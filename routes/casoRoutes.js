// casoRoutes.js corrigido
const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rotas públicas (se necessário)
// router.get('/', casoController.listarCasosPublicos); // Se quiser ter uma versão pública

// Aplicar middleware de autenticação para todas as rotas abaixo
router.use(authMiddleware);

// Rotas protegidas
router.post('/', casoController.criarCaso);
router.get('/', casoController.listarCasos);
router.get('/buscar', casoController.buscarCasos);
router.get('/:id', casoController.obterCaso);
router.put('/:id', casoController.atualizarCaso);
router.post('/:id/evidencias', uploadMiddleware.single('arquivo'), casoController.adicionarEvidencia);

module.exports = router;