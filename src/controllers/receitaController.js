const pool = require('../config/database');
const Receita = require('../models/receita');
const Categoria = require('../models/categoria');

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
            res.redirect('/admin/dashboard'); // Redireciona para o painel após salvar
        } catch (error) {
            console.error("Erro ao salvar receita:", error);
            res.status(500).send("Erro ao salvar a receita");
        }
    },

 
    excluir: async (req, res) => {
        try {
            const id = req.body.id;
            
            await Receita.excluir(id);
            
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error("ERRO AO EXCLUIR RECEITA NO BANCO:", error); 
            res.status(500).send("Erro ao excluir.");
        }
    },

    renderEditar: async (req, res) => {
    try {
        const id = req.params.id;
        const receita = await Receita.buscarPorId(id);
        if (!receita) return res.status(404).send("Receita não encontrada.");

        const todasCategorias = await Categoria.listarTodas();
        
        const resultCat = await pool.query('SELECT categoria_id FROM receita_categorias WHERE receita_id = $1', [id]);
        const idsMarcados = resultCat.rows.map(r => r.categoria_id);

        const todosAlunosRes = await pool.query('SELECT id, nome FROM alunos ORDER BY nome');
        const todosAlunos = todosAlunosRes.rows;

        const resultAutores = await pool.query('SELECT aluno_id FROM receita_autores WHERE receita_id = $1', [id]);
        const autoresMarcados = resultAutores.rows.map(r => r.aluno_id);

        res.render('portal/editar-receita', { 
            receita, 
            categorias: todasCategorias, 
            idsMarcados,
            alunos: todosAlunos,            
            autoresMarcados,               
            usuarioLogado: req.session.usuarioLogado 
        });
    } catch (error) {
        console.error("ERRO TÉCNICO DETALHADO:", error); 
        res.status(500).send("Erro ao carregar edição.");
    }
    },

    atualizar: async (req, res) => {
    try {
        const { id, nome, descricao, midia_url, categorias, coautores } = req.body;

        console.log(`--- Atualizando Receita ID: ${id} ---`);
        console.log("Categorias selecionadas:", categorias);
        console.log("Coautores selecionados:", coautores);

        let categoriasIds = [];
        if (Array.isArray(categorias)) categoriasIds = categorias.map(Number);
        else if (categorias) categoriasIds = [Number(categorias)];

        let coautoresIds = [];
        if (Array.isArray(coautores)) coautoresIds = coautores.map(Number);
        else if (coautores) coautoresIds = [Number(coautores)];


        await Receita.atualizar(id, nome, descricao, midia_url, categoriasIds, coautoresIds);
        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro crítico na atualização:", error);
        res.status(500).send("Erro ao salvar as alterações.");
    }
    }
};

module.exports = receitaController;