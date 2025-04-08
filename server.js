const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/db');

// Conexão simplificada para Mongoose 6+
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => {
    console.log('Erro ao conectar ao MongoDB:', err);
    process.exit(1); // Encerra o processo se não conectar
  });

// Configurações opcionais para logging
mongoose.connection.on('connected', () => {
  console.log('Banco de dados conectado:', mongoose.connection.db.databaseName);
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});