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
    },

    excluir: async (id) => {
        const query = 'DELETE FROM categorias WHERE id = $1';
        await db.query(query, [id]);
    },

    buscarPorId: async (id) => {
        const { rows } = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
        return rows[0];
    },
    
    atualizar: async (id, nome) => {
        await db.query('UPDATE categorias SET nome = $1 WHERE id = $2', [nome, id]);
    }
};

module.exports = Categoria;