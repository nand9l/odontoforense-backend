const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const casoRoutes = require('./routes/casoRoutes');
const laudoRoutes = require('./routes/laudoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// =============================================
// 1. MIDDLEWARES ESSENCIAIS (ORDEM IMPORTANTE)
// =============================================

// Middlewares de segurança (primeiros)
app.use(helmet());
app.use(cors());

// Middlewares de parsing de conteúdo
app.use(express.json()); // 👈 ÚNICA declaração necessária
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(morgan('dev'));

// =============================================
// 2. ROTAS
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/casos', casoRoutes);
app.use('/api/laudos', laudoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// =============================================
// 3. CONFIGURAÇÕES ADICIONAIS
// =============================================
// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API OdontoForense está funcionando',
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// =============================================
// 4. TRATAMENTO DE ERROS
// =============================================
app.use((err, req, res, next) => {
  console.error('[ERRO]', err.stack);
  res.status(500).json({
    error: 'Erro interno no servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;