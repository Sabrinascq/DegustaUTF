CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE habilidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE receitas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,       
    descricao TEXT NOT NULL,          
    link_externo VARCHAR(255)         
);

CREATE TABLE receita_categorias (
    receita_id INTEGER REFERENCES receitas(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (receita_id, categoria_id)
);

CREATE TABLE receita_autores (
    receita_id INTEGER REFERENCES receitas(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    PRIMARY KEY (receita_id, aluno_id)
);

CREATE TABLE aluno_habilidades (
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    habilidade_id INTEGER REFERENCES habilidades(id) ON DELETE CASCADE,
    nivel INTEGER CHECK (nivel >= 0 AND nivel <= 10),
    PRIMARY KEY (aluno_id, habilidade_id)
);

INSERT INTO categorias (nome) VALUES ('Sobremesas'), ('Pratos Salgados'), ('Vegana'), ('Massas');
INSERT INTO habilidades (nome) VALUES ('Corte Julienne'), ('Confeitaria'), ('Molhos de Base');