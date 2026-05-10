const mongoose = require('mongoose');

// Definindo a estrutura (Schema) do Comentário
const comentarioSchema = new mongoose.Schema({
    autor: {
        type: String,
        required: true // É obrigatório preencher o nome
    },
    texto: {
        type: String,
        required: true // É obrigatório ter a mensagem do comentário
    },
    nota: {
        type: Number,
        required: true,
        min: 1, // A nota mínima é 1
        max: 5  // A nota máxima é 5 estrelas
    },
    categoriaId: {
        type: Number,
        required: true // Para sabermos a qual categoria (1, 2 ou 3) esse comentário pertence
    },
    dataCriacao: {
        type: Date,
        default: Date.now // O próprio MongoDB preenche a data e hora do momento exato
    }
});

// Criando o modelo real que o Node.js vai usar
const Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;