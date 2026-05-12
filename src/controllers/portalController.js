const Comentario = require('../models/comentario'); // MongoDB
const Categoria = require('../models/categoria');   // PostgreSQL
const Receita = require('../models/receita');
const pool = require('../config/database'); // <-- ADICIONE ESTA LINHA

const portalController = {
    index: async (req, res) => {
        try {
            const categoriasReais = await Categoria.listarTodas();
            res.render('portal/index', { 
                categorias: categoriasReais,
                usuarioLogado: req.session.usuarioLogado || null 
            });
        } catch (erro) {
            console.error("Erro ao buscar categorias do Postgres:", erro);
            res.send("Erro ao carregar o portal.");
        }
    },

    verCategoria: async (req, res) => {
        const idDaCategoria = Number(req.params.id);
        try {
            const categoria = await Categoria.buscarPorId(idDaCategoria);
            const receitas = await Receita.buscarPorCategoria(idDaCategoria);
            
            res.render('portal/lista-receitas', { 
                categoria: categoria,
                receitas: receitas,
                usuarioLogado: req.session.usuarioLogado || null 
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).send("Erro ao buscar receitas.");
        }
    },

    salvarComentario: async (req, res) => {
        const idDaReceita = Number(req.params.id);
        const { autor, nota, texto } = req.body; 

        try {
            if (!req.session.usuarioLogado) return res.redirect('/login');

            await Comentario.create({
                autor,
                nota: Number(nota),
                texto,
                receitaId: idDaReceita 
            });
            res.redirect('/receita/' + idDaReceita); 
        } catch (erro) {
            res.send("Erro ao salvar o comentário.");
        }
    },

    verReceita: async (req, res) => {
        const idDaReceita = Number(req.params.id);
        try {
            const receita = await Receita.buscarPorId(idDaReceita);
            
            if (!receita) {
                return res.status(404).send("Receita não encontrada.");
            }

            const comentariosDoBanco = await Comentario.find({ receitaId: idDaReceita })
                                                     .sort({ dataCriacao: -1 });
            
            res.render('portal/receita', { 
                receita,
                comentarios: comentariosDoBanco,
                usuarioLogado: req.session.usuarioLogado || null 
            });
        } catch (erro) {
            console.error("Erro ao buscar detalhes da receita:", erro);
            res.status(500).send("Erro interno ao carregar a página.");
        }
    },

    relatorioHabilidades: async (req, res) => {
        try {
            const totalAlunosRes = await pool.query('SELECT COUNT(*) FROM alunos');
            const totalAlunos = parseInt(totalAlunosRes.rows[0].count);

            const query = `
                SELECT h.nome, COUNT(ah.aluno_id) as quantidade
                FROM habilidades h
                LEFT JOIN aluno_habilidades ah ON h.id = ah.habilidade_id
                GROUP BY h.id, h.nome`;
            
            const { rows } = await pool.query(query);

            const relatorio = rows.map(r => ({
                nome: r.nome,
                porcentagem: totalAlunos > 0 ? ((r.quantidade / totalAlunos) * 100).toFixed(1) : 0
            }));

            res.render('portal/relatorio', { relatorio });
        } catch (erro) {
            console.error("Erro no Relatório:", erro);
            res.status(500).send("Erro ao gerar relatório.");
        }
    }
};

module.exports = portalController;