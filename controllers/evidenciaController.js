const Evidencia = require('../models/Evidencia');
const Caso = require('../models/Caso');

// Criar uma nova evidência
exports.criarEvidencia = async (req, res) => {
  try {
    const { casoId, tipo, descricao, caminhoArquivo, uploadPor, metadados } = req.body;

    // Verifica se o caso existe
    const caso = await Caso.findById(casoId);
    if (!caso) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }

    // Cria a nova evidência
    const novaEvidencia = new Evidencia({
      caso: casoId,
      tipo,
      descricao,
      caminhoArquivo,
      uploadPor,
      metadados
    });

    await novaEvidencia.save();
    res.status(201).json({ message: 'Evidência criada com sucesso', evidencia: novaEvidencia });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar evidência', error: error.message });
  }
};

// Listar todas as evidências de um caso específico
exports.listarEvidenciasPorCaso = async (req, res) => {
  try {
    const { casoId } = req.params;

    // Verifica se o caso existe
    const caso = await Caso.findById(casoId);
    if (!caso) {
      return res.status(404).json({ message: 'Caso não encontrado' });
    }

    // Busca todas as evidências relacionadas ao caso
    const evidencias = await Evidencia.find({ caso: casoId })
      .populate('uploadPor', 'nome') // Popula o campo "uploadPor" com o nome do usuário
      .populate('caso', 'titulo'); // Popula o campo "caso" com o título do caso

    res.status(200).json({ evidencias });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar evidências', error: error.message });
  }
};

// Atualizar uma evidência
exports.atualizarEvidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descricao, caminhoArquivo, metadados } = req.body;

    // Atualiza a evidência
    const evidenciaAtualizada = await Evidencia.findByIdAndUpdate(
      id,
      { tipo, descricao, caminhoArquivo, metadados },
      { new: true, runValidators: true }
    );

    if (!evidenciaAtualizada) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }

    res.status(200).json({ message: 'Evidência atualizada com sucesso', evidencia: evidenciaAtualizada });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar evidência', error: error.message });
  }
};

// Deletar uma evidência
exports.deletarEvidencia = async (req, res) => {
  try {
    const { id } = req.params;

    // Deleta a evidência
    const evidenciaDeletada = await Evidencia.findByIdAndDelete(id);

    if (!evidenciaDeletada) {
      return res.status(404).json({ message: 'Evidência não encontrada' });
    }

    res.status(200).json({ message: 'Evidência deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evidência', error: error.message });
  }
};