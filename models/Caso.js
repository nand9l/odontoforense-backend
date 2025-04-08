const mongoose = require('mongoose');

const CasoSchema = new mongoose.Schema({
  numeroCaso: {
    type: String,
    required: true,
    unique: true
  },
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['aberto', 'em_andamento', 'concluido', 'arquivado'],
    default: 'aberto'
  },
  peritoResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  dataAbertura: {
    type: Date,
    default: Date.now
  },
  dataFechamento: {
    type: Date
  },
  caracteristicas: {
    type: Map,
    of: String
  },
  observacoes: {
    type: String
  }
});

module.exports = mongoose.model('Caso', CasoSchema);