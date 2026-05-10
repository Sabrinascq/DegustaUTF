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

                // REDIRECIONAMENTO INTELIGENTE
                if (usuario.eh_admin) {
                    res.redirect('/admin/dashboard');
                } else {
                    // O aluno não tem uma "home" própria, ele usa o PORTAL
                    res.redirect('/portal'); 
                }
            } else {
                // Se não achar o usuário, volta pro login com aviso
                res.render('login', { erro: 'E-mail ou senha incorretos.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
};

module.exports = loginController;