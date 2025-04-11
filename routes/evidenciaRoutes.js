const express = require('express');
const router = express.Router();
const EvidenciaController = require('../controllers/evidenciaController');

// Criar uma nova evidência
router.post('/casos/:casoId/evidencias', EvidenciaController.criarEvidencia);

// Listar todas as evidências de um caso específico
router.get('/casos/:casoId/evidencias', EvidenciaController.listarEvidenciasPorCaso);

// Atualizar uma evidência
router.put('/evidencias/:id', EvidenciaController.atualizarEvidencia);

// Deletar uma evidência
router.delete('/evidencias/:id', EvidenciaController.deletarEvidencia);

module.exports = router;