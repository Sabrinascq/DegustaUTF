require('./config/mongodb');
const express = require('express');
const session = require('express-session');
const path = require('path');

// Importação dos Controllers
const loginController = require('./controllers/loginController');
const adminController = require('./controllers/adminController');
const portalController = require('./controllers/portalController');

const app = express();

// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos (CSS, imagens se houver)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configuração de Sessão
app.use(session({
    secret: 'segredo_utfpr_123',
    resave: false,
    saveUninitialized: false
}));

// --- MIDDLEWARE GLOBAL ---
// Isso faz com que a variável 'usuarioLogado' fique disponível em todos os .ejs
app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.usuarioLogado || null;
    next();
});

// --- ROTAS DE LOGIN E LOGOUT ---
app.get('/login', loginController.renderLogin);
app.post('/login', loginController.fazerLogin);
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/portal');
});

// --- MIDDLEWARE DE PROTEÇÃO (ADMIN) ---
const verificarAdmin = (req, res, next) => {
    if (req.session.usuarioLogado && req.session.usuarioLogado.eh_admin === true) {
        next(); 
    } else {
        res.status(403).send('Acesso negado: você não tem permissão de administrador.');
    }
};

// --- ROTAS DO PAINEL ADMINISTRATIVO ---
app.get('/admin/dashboard', verificarAdmin, adminController.renderDashboard);
app.post('/admin/categorias', verificarAdmin, adminController.cadastrarCategoria);
app.post('/admin/habilidades', verificarAdmin, adminController.cadastrarHabilidade);
app.post('/admin/alunos', verificarAdmin, adminController.cadastrarAluno);
app.post('/admin/categorias/excluir', verificarAdmin, adminController.excluirCategoria);
app.post('/admin/habilidades/excluir', verificarAdmin, adminController.excluirHabilidade);
app.post('/admin/alunos/excluir', verificarAdmin, adminController.excluirAluno);
app.get('/admin/categorias/editar/:id', verificarAdmin, adminController.renderEditarCategoria);
app.get('/admin/habilidades/editar/:id', verificarAdmin, adminController.renderEditarHabilidade);
app.get('/admin/alunos/editar/:id', verificarAdmin, adminController.renderEditarAluno);
app.post('/admin/categorias/editar', verificarAdmin, adminController.atualizarCategoria);
app.post('/admin/habilidades/editar', verificarAdmin, adminController.atualizarHabilidade);
app.post('/admin/alunos/editar', verificarAdmin, adminController.atualizarAluno);

// Atalho para o dashboard
app.get('/dashboard', (req, res) => {
    res.redirect('/admin/dashboard');
});

// --- ROTAS DO PORTAL PÚBLICO ---

// Página inicial do portal
app.get('/portal', portalController.index);

// Ver os comentários de uma categoria específica
app.get('/portal/categoria/:id', portalController.verComentarios);

// Salvar um comentário (A lógica de bloqueio está no EJS e no Controller)
app.post('/portal/categoria/:id/comentar', portalController.salvarComentario);

// Rota raiz redireciona para o portal
app.get('/', (req, res) => {
    res.redirect('/portal');
});

// --- ROTAS DAS RECEITAS --

const receitaController = require('./controllers/receitaController');
app.get('/receitas/nova', receitaController.renderizarFormulario);
app.post('/receitas/cadastrar', receitaController.salvar);

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`DegustaUTF rodando em: http://localhost:${PORT}`);
    console.log(`Acesse o Portal: http://localhost:${PORT}/portal`);
    console.log(`Área de Login: http://localhost:${PORT}/login`);
    console.log(`--------------------------------------------------`);
}).on('error', (err) => {
    console.error('ALERTA: Erro ao tentar manter o servidor ligado:', err);
});