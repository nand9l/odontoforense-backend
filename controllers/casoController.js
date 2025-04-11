const Caso = require('../models/Caso');
const Evidencia = require('../models/Evidencia');
const Usuario = require('../models/Usuario');

exports.criarCaso = async (req, res) => {
  try {
    // Verificar se o usuário é um perito
    if (req.usuario.tipo !== 'perito') {
      return res.status(403).json({ 
        success: false,
        error: 'Apenas peritos podem criar casos' 
      });
    }

    // Validar campos obrigatórios
    const { numeroCaso, titulo, descricao, dataOcorrido, local } = req.body;
    if (!numeroCaso || !titulo || !descricao || !dataOcorrido || !local) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando: numeroCaso, titulo, descricao, dataOcorrido, local'
      });
    }

    // Verificar se número do caso já existe
    const casoExistente = await Caso.findOne({ numeroCaso });
    if (casoExistente) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um caso com este número'
      });
    }

    const novoCaso = new Caso({
      ...req.body,
      peritoResponsavel: req.usuario.id
    });

    const casoSalvo = await novoCaso.save();
    
    res.status(201).json({
      success: true,
      data: casoSalvo
    });

  } catch (err) {
    console.error('Erro ao criar caso:', err.message);
    
    // Tratar erros de validação do Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        error: 'Erro de validação',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao criar caso'
    });
  }
};

exports.listarCasos = async (req, res) => {
  try {
    let query = {};
    let options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: { dataAbertura: -1 },
      populate: {
        path: 'peritoResponsavel',
        select: 'nome email'
      }
    };

    // Peritos só veem seus próprios casos
    if (req.usuario.tipo === 'perito') {
      query.peritoResponsavel = req.usuario.id;
    }

    // Filtro por status se fornecido
    if (req.query.status) {
      query.status = req.query.status;
    }

    const casos = await Caso.paginate(query, options);
    
    res.json({
      success: true,
      data: casos
    });
  } catch (err) {
    console.error('Erro ao listar casos:', err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao listar casos'
    });
  }
};

exports.obterCaso = async (req, res) => {
  try {
    const caso = await Caso.findById(req.params.id)
      .populate('peritoResponsavel', 'nome email')
      .populate('evidencias', 'caminhoArquivo nomeOriginal tipo dataUpload');
      
    if (!caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso não encontrado'
      });
    }

    // Verificar se o usuário tem permissão para ver o caso
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel._id.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado - Você só pode visualizar seus próprios casos'
      });
    }

    res.json({
      success: true,
      data: caso
    });
  } catch (err) {
    console.error('Erro ao obter caso:', err.message);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID do caso inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao obter caso'
    });
  }
};

exports.atualizarCaso = async (req, res) => {
  try {
    let caso = await Caso.findById(req.params.id);
    
    if (!caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso não encontrado'
      });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado - Você só pode editar seus próprios casos'
      });
    }

    // Impedir alteração do número do caso
    if (req.body.numeroCaso && req.body.numeroCaso !== caso.numeroCaso) {
      return res.status(400).json({
        success: false,
        error: 'Não é permitido alterar o número do caso'
      });
    }

    // Atualizar o caso
    caso = await Caso.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true,
        runValidators: true
      }
    ).populate('peritoResponsavel', 'nome email');

    res.json({
      success: true,
      data: caso
    });
  } catch (err) {
    console.error('Erro ao atualizar caso:', err.message);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        error: 'Erro de validação',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao atualizar caso'
    });
  }
};

exports.buscarCasos = async (req, res) => {
  try {
    const { termo } = req.query;
    
    if (!termo || termo.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Termo de busca não fornecido'
      });
    }

    let query = {
      $or: [
        { numeroCaso: { $regex: termo, $options: 'i' } },
        { titulo: { $regex: termo, $options: 'i' } },
        { descricao: { $regex: termo, $options: 'i' } },
        { local: { $regex: termo, $options: 'i' } }
      ]
    };

    // Peritos só veem seus próprios casos
    if (req.usuario.tipo === 'perito') {
      query.peritoResponsavel = req.usuario.id;
    }

    const casos = await Caso.find(query)
      .populate('peritoResponsavel', 'nome email')
      .sort({ dataAbertura: -1 })
      .limit(20);
      
    res.json({
      success: true,
      count: casos.length,
      data: casos
    });
  } catch (err) {
    console.error('Erro ao buscar casos:', err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao buscar casos'
    });
  }
};

exports.adicionarEvidencia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }

    const caso = await Caso.findById(req.params.id);
    if (!caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso não encontrado'
      });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado - Você só pode adicionar evidências aos seus próprios casos'
      });
    }

    const novaEvidencia = new Evidencia({
      caso: req.params.id,
      caminhoArquivo: req.file.path,
      nomeOriginal: req.file.originalname,
      tipo: req.file.mimetype,
      tamanho: req.file.size,
      enviadoPor: req.usuario.id
    });

    await novaEvidencia.save();
    
    // Atualizar o caso com referência à nova evidência
    await Caso.findByIdAndUpdate(
      req.params.id,
      { $push: { evidencias: novaEvidencia._id } }
    );

    res.status(201).json({
      success: true,
      data: novaEvidencia
    });
  } catch (err) {
    console.error('Erro ao adicionar evidência:', err.message);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID do caso inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao adicionar evidência'
    });
  }
};