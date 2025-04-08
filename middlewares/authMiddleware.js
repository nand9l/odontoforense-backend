const jwt = require('jsonwebtoken');
const config = require('../config/db');

module.exports = function(req, res, next) {
  // Obter token do header
  const token = req.header('x-auth-token');

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({ msg: 'Token não encontrado, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, config.secretOrKey);
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};