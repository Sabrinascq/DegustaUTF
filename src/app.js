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
    if (req.session.usuarioLogado) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/admin/dashboard', verificarAdmin, adminController.renderDashboard);
app.post('/admin/categorias', verificarAdmin, adminController.cadastrarCategoria);
app.post('/admin/habilidades', verificarAdmin, adminController.cadastrarHabilidade);

app.get('/dashboard', (req, res) => {
    res.redirect('/admin/dashboard');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/login`);
});