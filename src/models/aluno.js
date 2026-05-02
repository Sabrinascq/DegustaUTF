const db = require('../config/database');

const Aluno = {
    buscarPorEmailSenha: async (email, senha) => {
        const query = 'SELECT * FROM alunos WHERE email = $1 AND senha = $2';
        const values = [email, senha];
        
        try {
            const { rows } = await db.query(query, values);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    },

    listarTodos: async () => {
        const query = 'SELECT id, nome, email, eh_admin FROM alunos ORDER BY id ASC';
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    cadastrar: async (nome, email, senha) => {
        const query = 'INSERT INTO alunos (nome, email, senha) VALUES ($1, $2, $3) RETURNING *';
        const values = [nome, email, senha];
        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Aluno;