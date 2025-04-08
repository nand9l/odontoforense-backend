const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rotas abertas (teste inicial)
router.post('/', casoController.criarCaso);
router.get('/', casoController.listarCasos);
router.get('/buscar', casoController.buscarCasos);
router.get('/:id', casoController.obterCaso);
router.put('/:id', casoController.atualizarCaso);
router.post('/:id/evidencias', (req, res) => {
  res.json({ message: "Upload de evidência (implementar middleware depois)" });
});

/* 
// Rotas protegidas (versão final)
router.use(authMiddleware);

router.post('/', casoController.criarCaso);
router.get('/', casoController.listarCasos);
router.get('/buscar', casoController.buscarCasos);
router.get('/:id', casoController.obterCaso);
router.put('/:id', casoController.atualizarCaso);
router.post('/:id/evidencias', uploadMiddleware.single('arquivo'), (req, res) => {
  // Lógica de upload aqui
});
*/

module.exports = router;
