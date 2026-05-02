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
    }
};

module.exports = Habilidade;