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
    }
};

module.exports = Aluno;