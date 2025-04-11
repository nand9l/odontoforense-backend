const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Rotas abertas (para teste inicial)
router.post('/', usuarioController.criarUsuario);
router.get('/', usuarioController.listarUsuarios);
router.get('/:email', usuarioController.obterUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.put('/:email', usuarioController.desativarUsuario);
router.put('/:id/reativar', usuarioController.reativarUsuario);

/*
// Rotas protegidas (versão final)
router.use(authMiddleware);

router.post('/', usuarioController.criarUsuario);
router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obterUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.put('/:id/desativar', usuarioController.desativarUsuario);
router.put('/:id/reativar', usuarioController.reativarUsuario);
*/

module.exports = router;