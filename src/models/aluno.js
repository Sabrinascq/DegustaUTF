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
    },

    excluir: async (id) => {
        const query = 'DELETE FROM alunos WHERE id = $1';
        await db.query(query, [id]);
    },

    buscarPorId: async (id) => {
        const { rows } = await db.query('SELECT * FROM alunos WHERE id = $1', [id]);
        return rows[0];
    },
    atualizar: async (id, nome, email) => {
        await db.query('UPDATE alunos SET nome = $1, email = $2 WHERE id = $3', [nome, email, id]);
    }
};

module.exports = Aluno;