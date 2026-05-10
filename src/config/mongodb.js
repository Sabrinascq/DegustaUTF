const mongoose = require('mongoose');

// Link para o seu computador (local), sem senhas e sem internet
const mongoURI = 'mongodb://127.0.0.1:27017/degusta_nosql';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conexão com o MongoDB LOCAL realizada com sucesso!'))
  .catch(err => console.error('❌ Erro no MongoDB Local:', err.message));

module.exports = mongoose;