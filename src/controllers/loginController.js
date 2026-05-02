const Aluno = require('../models/aluno');

const loginController = {
    renderLogin: (req, res) => {
        res.render('login', { erro: null });
    },

    fazerLogin: async (req, res) => {
        const { email, senha } = req.body;

        try {
            const usuario = await Aluno.buscarPorEmailSenha(email, senha);

            if (usuario) {
                req.session.usuarioLogado = usuario;
                res.redirect('/dashboard');
            } else {
                res.render('login', { erro: 'Email ou senha inválidos!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
};

module.exports = loginController;