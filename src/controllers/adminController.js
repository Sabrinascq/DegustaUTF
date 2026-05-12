const Categoria = require('../models/categoria');
const Habilidade = require('../models/habilidade');
const Aluno = require('../models/aluno');
const pool = require('../config/database'); // Importado para buscar as receitas

const adminController = {
    renderDashboard: async (req, res) => {
        try {
            const usuario = req.session.usuarioLogado; 
            let receitas;

            if (usuario.eh_admin) {
                const result = await pool.query('SELECT id, nome FROM receitas ORDER BY id DESC');
                receitas = result.rows;
            } else {
                const result = await pool.query(`
                    SELECT r.id, r.nome FROM receitas r
                    JOIN receita_autores ra ON r.id = ra.receita_id
                    WHERE ra.aluno_id = $1`, [usuario.id]);
                receitas = result.rows;
            }

            const resultadoHabilidades = await pool.query('SELECT * FROM habilidades ORDER BY nome');

            const habilidadesDoAluno = await pool.query(`
                SELECT h.nome, ah.nivel, h.id 
                FROM habilidades h
                JOIN aluno_habilidades ah ON h.id = ah.habilidade_id
                WHERE ah.aluno_id = $1`, [usuario.id]);

            res.render('dashboard', { 
                usuario, 
                receitas,
                alunos: usuario.eh_admin ? (await Aluno.listarTodos()) : [],
                categorias: await Categoria.listarTodas(),
                habilidades: resultadoHabilidades.rows, 
                habilidadesDoAluno: habilidadesDoAluno.rows
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
            const { nome_aluno, email_aluno, senha_aluno, eh_admin } = req.body;
            
            // Transforma o valor do checkbox 'on' em true, caso contrário false
            const isAdmin = eh_admin === 'on' ? true : false;
            
            // Passa o isAdmin como o 4º parâmetro para o Model
            await Aluno.cadastrar(nome_aluno, email_aluno, senha_aluno, isAdmin);
            
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
        try {
            const { id, nome, email, eh_admin } = req.body;
            
            // Mesma lógica: converte para booleano
            const isAdmin = eh_admin === 'on' ? true : false;

            // Passa o isAdmin para o Model
            await Aluno.atualizar(id, nome, email, isAdmin);
            
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            res.status(500).send('Erro ao atualizar aluno.');
        }
    }
};

module.exports = adminController;