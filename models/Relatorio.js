const mongoose = require('mongoose');

const RelatorioSchema = new mongoose.Schema({
  caso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caso', 
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['rascunho', 'em_andamento', 'finalizado'],
    default: 'rascunho'
  },
  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', 
    required: true
  },
  observacoes: {
    type: String
  }
});

module.exports = mongoose.model('Relatorio', RelatorioSchema);