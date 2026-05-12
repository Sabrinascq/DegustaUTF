const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'degustaUTF',
    password: 'THIAGAO',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.stack);
    }
    console.log('Conexão com o PostgreSQL bem-sucedida!');
    release();
});

module.exports = pool;