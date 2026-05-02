const Categoria = require('../models/categoria');
const Habilidade = require('../models/habilidade');

const adminController = {
    renderDashboard: async (req, res) => {
        try {
            const categorias = await Categoria.listarTodas();
            const habilidades = await Habilidade.listarTodas();
            
            res.render('dashboard', { 
                usuario: req.session.usuarioLogado,
                categorias,
                habilidades 
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
    }
};

module.exports = adminController;