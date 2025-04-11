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
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.dataAbertura;
      },
      message: 'Data de fechamento deve ser posterior à data de abertura'
    }
  },
  caracteristicas: {
    type: Map,
    of: String
  },
  observacoes: {
    type: String
  },
  dataOcorrido: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Data do ocorrido não pode ser no futuro'
    }
  },
  local: {
    type: String,
    required: true 
  }
});

module.exports = mongoose.model('Caso', CasoSchema);