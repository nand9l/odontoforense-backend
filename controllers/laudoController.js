const Laudo = require('../models/Laudo');
const Caso = require('../models/Caso');

exports.criarLaudo = async (req, res) => {
  try {
    const caso = await Caso.findById(req.body.caso);
    
    if (!caso) {
      return res.status(404).json({ msg: 'Caso não encontrado' });
    }

    // Verificar se o usuário é o perito responsável
    if (req.usuario.tipo === 'perito' && caso.peritoResponsavel.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    const novoLaudo = new Laudo({
      ...req.body,
      perito: req.usuario.id
    });

    const laudo = await novoLaudo.save();
    
    // Atualizar status do caso para "em_andamento"
    await Caso.findByIdAndUpdate(req.body.caso, { status: 'em_andamento' });

    res.json(laudo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.listarLaudos = async (req, res) => {
  try {
    let query = {};
    
    // Peritos só veem seus próprios laudos
    if (req.usuario.tipo === 'perito') {
      query.perito = req.usuario.id;
    }

    const laudos = await Laudo.find(query)
      .populate('caso', 'numeroCaso titulo')
      .populate('perito', 'nome')
      .sort({ dataEmissao: -1 });
      
    res.json(laudos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.obterLaudo = async (req, res) => {
  try {
    const laudo = await Laudo.findById(req.params.id)
      .populate('caso', 'numeroCaso titulo')
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

    // Não permitir alterar o caso ou perito
    if (req.body.caso || req.body.perito) {
      return res.status(400).json({ msg: 'Não é permitido alterar o caso ou perito' });
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