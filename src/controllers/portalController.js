const Comentario = require('../models/comentario'); // MongoDB
const Categoria = require('../models/categoria');   // PostgreSQL

const portalController = {
    index: async (req, res) => {
        try {
            const categoriasReais = await Categoria.listarTodas();
            res.render('portal/index', { 
                categorias: categoriasReais,
                // ADICIONADO: Envia a sessão para o index
                usuarioLogado: req.session.usuarioLogado || null 
            });
        } catch (erro) {
            console.error("Erro ao buscar categorias do Postgres:", erro);
            res.send("Erro ao carregar o portal.");
        }
    },

    verComentarios: async (req, res) => {
        const idDaCategoria = Number(req.params.id);
        try {
            const categoria = await Categoria.buscarPorId(idDaCategoria);
            const comentariosDoBanco = await Comentario.find({ categoriaId: idDaCategoria }).sort({ dataCriacao: -1 });
            
            res.render('portal/comentarios', { 
                categoriaId: idDaCategoria,
                nomeCategoria: categoria ? categoria.nome : "Categoria",
                comentarios: comentariosDoBanco,
                // ADICIONADO: Aqui é onde libera o formulário de comentários!
                usuarioLogado: req.session.usuarioLogado || null 
            });
        } catch (erro) {
            console.error(erro);
            res.send("Erro ao buscar comentários.");
        }
    },

    salvarComentario: async (req, res) => {
        const idDaCategoria = Number(req.params.id);
        const { autor, nota, texto } = req.body; 

        try {
            // Segurança extra: só salva se houver alguém na sessão
            if (!req.session.usuarioLogado) {
                return res.redirect('/login');
            }

            await Comentario.create({
                autor: autor,
                nota: Number(nota),
                texto: texto,
                categoriaId: idDaCategoria
            });

            res.redirect('/portal/categoria/' + idDaCategoria);
        } catch (erro) {
            console.error(erro);
            res.send("Erro ao salvar o comentário.");
        }
    }
};

module.exports = portalController;