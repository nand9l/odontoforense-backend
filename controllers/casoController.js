const Caso = require('../models/Caso');
const Evidencia = require('../models/Evidencia');

exports.criarCaso = async (req, res) => {
  try {
    const novoCaso = new Caso({
      ...req.body,
      peritoResponsavel: req.usuario.id
    });

    const caso = await novoCaso.save();
    res.json(caso);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.listarCasos = async (req, res) => {
  try {
    let query = {};
    
    // Peritos só veem seus próprios casos
    if (req.usuario.tipo === 'perito') {
      query.peritoResponsavel = req.usuario.id;
    }

    const casos = await Caso.find(query)
      .populate('peritoResponsavel', 'nome email')
      .sort({ dataAbertura: -1 });
      
    res.json(casos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.obterCaso = async (req, res) => {
  try {
    const caso = await Caso.findById(req.params.id)
      .populate('peritoResponsavel', 'nome email');
      
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // Verificar se o usuário tem permissão para ver o caso
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel._id.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    const evidencias = await Evidencia.find({ caso: req.params.id });
    
    res.json({ caso, evidencias });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.atualizarCaso = async (req, res) => {
  try {
    let caso = await Caso.findById(req.params.id);
    
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // Verificar permissões
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    caso = await Caso.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(caso);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.buscarCasos = async (req, res) => {
  try {
    const { termo } = req.query;
    
    let query = {
      $or: [
        { numeroCaso: { $regex: termo, $options: 'i' } },
        { titulo: { $regex: termo, $options: 'i' } },
        { descricao: { $regex: termo, $options: 'i' } }
      ]
    };

    // Peritos só veem seus próprios casos
    if (req.usuario.tipo === 'perito') {
      query.peritoResponsavel = req.usuario.id;
    }

    const casos = await Caso.find(query)
      .populate('peritoResponsavel', 'nome email')
      .sort({ dataAbertura: -1 });
      
    res.json(casos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};