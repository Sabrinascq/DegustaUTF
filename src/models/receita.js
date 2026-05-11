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
    }
};

module.exports = Receita;