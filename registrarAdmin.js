const mongoose = require('mongoose');
const Usuario = require('./models/Usuario.js');
const bcrypt = require('bcryptjs');

// Configuração da conexão com o MongoDB - REMOVA SUAS CREDENCIAIS ANTES DE COMPARTILHAR
const dbURI = 'mongodb+srv://Fernando:nando123@cluster0.tjezx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Função para conectar ao banco de dados (ATUALIZADA)
async function conectarDB() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // Removido useCreateIndex pois não é mais suportado
    });
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
}

// Função para registrar um administrador (MELHORADA)
async function registrarAdministrador(dadosAdmin) {
  try {
    // Verificar se o email já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email: dadosAdmin.email });
    if (usuarioExistente) {
      throw new Error('Email já está em uso');
    }

    // Criar o novo administrador
    const admin = new Usuario({
      nome: dadosAdmin.nome,
      email: dadosAdmin.email.toLowerCase(), // Normaliza o email
      senha: dadosAdmin.senha,
      tipo: 'administrador',
      ativo: true,
      createdAt: new Date()
    });

    // Salvar no banco de dados
    const adminSalvo = await admin.save();
    console.log('Administrador registrado com sucesso:', {
      id: adminSalvo._id,
      nome: adminSalvo.nome,
      email: adminSalvo.email,
      tipo: adminSalvo.tipo
    });
    return adminSalvo;
  } catch (err) {
    console.error('Erro ao registrar administrador:', err.message);
    throw err;
  }
}

// Dados do administrador (ALTERE PARA SUAS CREDENCIAIS)
const dadosAdministrador = {
  nome: 'Cr7',
  email: 'cr7@example.com',
  senha: '123' // Senha fraca - para produção use algo mais seguro
};

// Executar o script (ATUALIZADO)
(async () => {
  try {
    await conectarDB();
    const admin = await registrarAdministrador(dadosAdministrador);
    console.log('Registro concluído para:', admin.email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Erro no processo de registro:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
})();