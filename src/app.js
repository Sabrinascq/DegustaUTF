const express = require('express');
const session = require('express-session');
const path = require('path');
const loginController = require('./controllers/loginController');

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

app.get('/dashboard', (req, res) => {
    if (req.session.usuarioLogado) {
        res.send(`<h1>Bem-vindo, ${req.session.usuarioLogado.nome}!</h1>`);
    } else {
        res.redirect('/login');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/login`);
});