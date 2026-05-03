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
    },

    excluirCategoria: async (req, res) => {
        try {
            await Categoria.excluir(req.body.id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            res.status(500).send('Erro. Talvez existam receitas usando esta categoria.');
        }
    },

    excluirHabilidade: async (req, res) => {
        try {
            await Habilidade.excluir(req.body.id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao excluir habilidade:', error);
            res.status(500).send('Erro ao excluir habilidade.');
        }
    },

    excluirAluno: async (req, res) => {
        try {
            if (req.body.id == req.session.usuarioLogado.id) {
                return res.send('<script>alert("Você não pode excluir a si mesmo!"); window.location.href="/admin/dashboard";</script>');
            }
            await Aluno.excluir(req.body.id);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
            res.status(500).send('Erro ao excluir aluno.');
        }
    },

    renderEditarCategoria: async (req, res) => {
        const categoria = await Categoria.buscarPorId(req.params.id);
        res.render('editar', { tipo: 'Categoria', item: categoria, acao: '/admin/categorias/editar' });
    },
    renderEditarHabilidade: async (req, res) => {
        const habilidade = await Habilidade.buscarPorId(req.params.id);
        res.render('editar', { tipo: 'Habilidade', item: habilidade, acao: '/admin/habilidades/editar' });
    },
    renderEditarAluno: async (req, res) => {
        const aluno = await Aluno.buscarPorId(req.params.id);
        res.render('editar', { tipo: 'Aluno', item: aluno, acao: '/admin/alunos/editar' });
    },

    atualizarCategoria: async (req, res) => {
        await Categoria.atualizar(req.body.id, req.body.nome);
        res.redirect('/admin/dashboard');
    },
    atualizarHabilidade: async (req, res) => {
        await Habilidade.atualizar(req.body.id, req.body.nome);
        res.redirect('/admin/dashboard');
    },
    atualizarAluno: async (req, res) => {
        await Aluno.atualizar(req.body.id, req.body.nome, req.body.email);
        res.redirect('/admin/dashboard');
    }

};

module.exports = adminController;