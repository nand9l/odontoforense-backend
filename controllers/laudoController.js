const Laudo = require('../models/Laudo');
const Evidencia = require('../models/Evidencia');

// Criar um novo laudo
exports.criarLaudo = async (req, res) => {
  try {
    const { evidenciaId } = req.body;

    // Verificar se a evidência existe
    const evidencia = await Evidencia.findById(evidenciaId);
    if (!evidencia) {
      return res.status(404).json({ msg: 'Evidência não encontrada' });
    }

    // Verificar se o usuário é o perito responsável pela evidência
    if (req.usuario.tipo === 'perito' && evidencia.uploadPor.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // Criar o laudo
    const novoLaudo = new Laudo({
      ...req.body,
      perito: req.usuario.id
    });

    const laudo = await novoLaudo.save();

    // Atualizar o status da evidência (opcional)
    await Evidencia.findByIdAndUpdate(evidenciaId, { status: 'analisada' });

    res.json(laudo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Listar todos os laudos
exports.listarLaudos = async (req, res) => {
  try {
    let query = {};

    // Peritos só veem seus próprios laudos
    if (req.usuario.tipo === 'perito') {
      query.perito = req.usuario.id;
    }

    const laudos = await Laudo.find(query)
      .populate('evidencia', 'tipo descricao')
      .populate('perito', 'nome')
      .sort({ dataEmissao: -1 });

    res.json(laudos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Obter um laudo específico
exports.obterLaudo = async (req, res) => {
  try {
    const laudo = await Laudo.findById(req.params.id)
      .populate('evidencia', 'tipo descricao')
      .populate('perito', 'nome email');

    if (!laudo) {
      return res.status(404).json({ msg: 'Laudo não encontrado' });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && laudo.perito._id.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    res.json(laudo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Atualizar um laudo
exports.atualizarLaudo = async (req, res) => {
  try {
    let laudo = await Laudo.findById(req.params.id);

    if (!laudo) {
      return res.status(404).json({ msg: 'Laudo não encontrado' });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && laudo.perito.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // Não permitir alterar a evidência ou o perito
    if (req.body.evidencia || req.body.perito) {
      return res.status(400).json({ msg: 'Não é permitido alterar a evidência ou o perito' });
    }

    laudo = await Laudo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(laudo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Finalizar um laudo
exports.finalizarLaudo = async (req, res) => {
  try {
    let laudo = await Laudo.findById(req.params.id);

    if (!laudo) {
      return res.status(404).json({ msg: 'Laudo não encontrado' });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && laudo.perito.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    laudo = await Laudo.findByIdAndUpdate(
      req.params.id,
      { status: 'finalizado' },
      { new: true }
    );

    res.json(laudo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};