const pool = require('../config/database');
const Receita = require('../models/receita');

const receitaController = {
   
    renderizarFormulario: async (req, res) => {
        try {
           
            const resultCategorias = await pool.query('SELECT * FROM categorias');
            const resultAlunos = await pool.query('SELECT * FROM alunos');

            res.render('portal/nova-receita', {
                categorias: resultCategorias.rows,
                alunos: resultAlunos.rows,
                usuarioLogado: req.session.usuarioLogado 
            });
        } catch (error) {
            console.error("Erro ao carregar formulário:", error);
            res.status(500).send("Erro interno do servidor");
        }
    },

    
    salvar: async (req, res) => {
        try {
            const { nome, descricao, midia_url, categorias, autores } = req.body;

            
        
            const arrayCategorias = Array.isArray(categorias) ? categorias : (categorias ? [categorias] : []);
            const arrayAutores = Array.isArray(autores) ? autores : (autores ? [autores] : []);

            
            if (req.session.usuarioLogado && !arrayAutores.includes(String(req.session.usuarioLogado.id))) {
                arrayAutores.push(req.session.usuarioLogado.id);
            }

            
            await Receita.criar(nome, descricao, midia_url, arrayCategorias, arrayAutores);

            
            res.redirect('/portal');
        } catch (error) {
            console.error("Erro ao salvar receita:", error);
            res.status(500).send("Erro ao salvar a receita");
        }
    }
};

module.exports = receitaController;