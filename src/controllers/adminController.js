const Categoria = require('../models/categoria');
const Habilidade = require('../models/habilidade');
const Aluno = require('../models/aluno');

const adminController = {
    renderDashboard: async (req, res) => {
        try {
            const categorias = await Categoria.listarTodas();
            const habilidades = await Habilidade.listarTodas();
            const alunos = await Aluno.listarTodos();

            res.render('dashboard', { 
                usuario: req.session.usuarioLogado,
                categorias,
                habilidades,
                alunos
            });
        } catch (error) {
            console.error('Erro ao carregar o dashboard:', error);
            res.status(500).send('Erro ao carregar dados.');
        }
    },

    cadastrarCategoria: async (req, res) => {
        try {
            const { nome_categoria } = req.body;
            if (nome_categoria) await Categoria.cadastrar(nome_categoria);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao cadastrar categoria:', error);
            res.status(500).send('Erro ao cadastrar categoria. Ela já pode existir.');
        }
    },

    cadastrarHabilidade: async (req, res) => {
        try {
            const { nome_habilidade } = req.body;
            if (nome_habilidade) await Habilidade.cadastrar(nome_habilidade);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao cadastrar habilidade:', error);
            res.status(500).send('Erro ao cadastrar habilidade. Ela já pode existir.');
        }
    },

    cadastrarAluno: async (req, res) => {
        try {
            const { nome_aluno, email_aluno, senha_aluno } = req.body;
            await Aluno.cadastrar(nome_aluno, email_aluno, senha_aluno);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            res.status(500).send('Erro ao cadastrar aluno. O e-mail já pode estar em uso.');
        }
    }

};

module.exports = adminController;