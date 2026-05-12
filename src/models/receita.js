const pool = require('../config/database');

const Receita = {
    
    criar: async (nome, descricao, midia_url, categoriasIds, autoresIds) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); 

          
            const queryReceita = 'INSERT INTO receitas (nome, descricao, midia_url) VALUES ($1, $2, $3) RETURNING id';
            const resReceita = await client.query(queryReceita, [nome, descricao, midia_url]);
            const receitaId = resReceita.rows[0].id;

           
            if (categoriasIds && categoriasIds.length > 0) {
                for (let catId of categoriasIds) {
                    await client.query('INSERT INTO receita_categorias (receita_id, categoria_id) VALUES ($1, $2)', [receitaId, catId]);
                }
            }

            
            if (autoresIds && autoresIds.length > 0) {
                for (let alunoId of autoresIds) {
                    await client.query('INSERT INTO receita_autores (receita_id, aluno_id) VALUES ($1, $2)', [receitaId, alunoId]);
                }
            }

            await client.query('COMMIT'); // Se tudo deu certo, confirma no banco!
            return receitaId;
        } catch (error) {
            await client.query('ROLLBACK'); // Se der erro em alguma parte, desfaz tudo
            throw error;
        } finally {
            client.release();
        }
    },

    // src/models/receita.js
    buscarPorId: async (id) => {
    const query = `
        SELECT r.*, 
               string_agg(DISTINCT c.nome, ', ') as categorias,
               string_agg(DISTINCT a.nome, ', ') as autores
        FROM receitas r
        LEFT JOIN receita_categorias rc ON r.id = rc.receita_id
        LEFT JOIN categorias c ON rc.categoria_id = c.id
        LEFT JOIN receita_autores ra ON r.id = ra.receita_id
        LEFT JOIN alunos a ON ra.aluno_id = a.id
        WHERE r.id = $1
        GROUP BY r.id
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
    },

    buscarPorCategoria: async (categoriaId) => {
        const query = `
            SELECT r.* FROM receitas r
            JOIN receita_categorias rc ON r.id = rc.receita_id
            WHERE rc.categoria_id = $1
        `;
        const { rows } = await pool.query(query, [categoriaId]);
        return rows;
    },

    excluir: async (id) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query('DELETE FROM receita_autores WHERE receita_id = $1', [id]);

            await client.query('DELETE FROM receita_categorias WHERE receita_id = $1', [id]);

            await client.query('DELETE FROM receitas WHERE id = $1', [id]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    atualizar: async (id, nome, descricao, midia_url, categoriasIds, coautoresIds) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(
            'UPDATE receitas SET nome = $1, descricao = $2, midia_url = $3 WHERE id = $4',
            [nome, descricao, midia_url, id]
        );

        await client.query('DELETE FROM receita_categorias WHERE receita_id = $1', [id]);
        if (categoriasIds.length > 0) {
            for (let catId of categoriasIds) {
                await client.query('INSERT INTO receita_categorias (receita_id, categoria_id) VALUES ($1, $2)', [id, catId]);
            }
        }

        await client.query('DELETE FROM receita_autores WHERE receita_id = $1', [id]);

        if (coautoresIds.length > 0) {
            for (let alunoId of coautoresIds) {
                await client.query('INSERT INTO receita_autores (receita_id, aluno_id) VALUES ($1, $2)', [id, alunoId]);
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
    }
};

module.exports = Receita;