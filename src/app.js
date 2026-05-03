const express = require('express');
const session = require('express-session');
const path = require('path');
const loginController = require('./controllers/loginController');
const adminController = require('./controllers/adminController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'segredo_utfpr_123',
    resave: false,
    saveUninitialized: false
}));

app.get('/login', loginController.renderLogin);
app.post('/login', loginController.fazerLogin);

const verificarAdmin = (req, res, next) => {
    if (req.session.usuarioLogado && req.session.usuarioLogado.eh_admin === true) {
        next(); 
    } else {
        res.status(403).send('Acesso negado: você não tem permissão de administrador.');
    }
};

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

app.get('/dashboard', (req, res) => {
    res.redirect('/admin/dashboard');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/login`);
});