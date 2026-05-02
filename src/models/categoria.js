const db = require('../config/database');

const Categoria = {
    listarTodas: async () => {
        const query = 'SELECT * FROM categorias ORDER BY nome ASC';
        const { rows } = await db.query(query);
        return rows;
    },

    cadastrar: async (nome) => {
        const query = 'INSERT INTO categorias (nome) VALUES ($1) RETURNING *';
        const values = [nome];
        const { rows } = await db.query(query, values);
        return rows[0];
    }
};

module.exports = Categoria;