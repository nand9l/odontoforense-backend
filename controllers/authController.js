const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/db');
const Usuario = require('../models/Usuario');

// Removido o método de registro público

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(403).json({ msg: 'Conta desativada. Contate o administrador.' });
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      usuario: {
        id: usuario.id,
        tipo: usuario.tipo
      }
    };

    jwt.sign(
      payload,
      config.secretOrKey,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-senha');
    res.json(usuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};