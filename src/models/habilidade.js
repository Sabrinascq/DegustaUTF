const db = require('../config/database');

const Habilidade = {
    listarTodas: async () => {
        const query = 'SELECT * FROM habilidades ORDER BY nome ASC';
        const { rows } = await db.query(query);
        return rows;
    },

    cadastrar: async (nome) => {
        const query = 'INSERT INTO habilidades (nome) VALUES ($1) RETURNING *';
        const values = [nome];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    excluir: async (id) => {
        const query = 'DELETE FROM habilidades WHERE id = $1';
        await db.query(query, [id]);
    },

    buscarPorId: async (id) => {
        const { rows } = await db.query('SELECT * FROM habilidades WHERE id = $1', [id]);
        return rows[0];
    },
    atualizar: async (id, nome) => {
        await db.query('UPDATE habilidades SET nome = $1 WHERE id = $2', [nome, id]);
    }
};

module.exports = Habilidade;