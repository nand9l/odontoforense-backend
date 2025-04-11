const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/usuario
// @desc    Obter usuário logado
// @access  Private
router.get('/usuario', authController.getUsuario);

module.exports = router;