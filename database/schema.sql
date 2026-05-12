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

INSERT INTO categorias (nome) VALUES 
('Bebidas e Drinks'),
('Carnes e Grelhados'),
('Frutos do Mar'),
('Lanches Rápidos'),
('Massas'),
('Panificação'),
('Pratos Salgados'),
('Sobremesas'),
('Sopas e Caldos'),
('Vegana');

INSERT INTO habilidades (nome) VALUES 
('Confeitaria'),
('Controle de Ponto de Carne'),
('Corte Julienne'),
('Desossa de Aves/Peixes'),
('Empanamento Perfeito'),
('Emulsão'),
('Fermentação Natural (Pães)'),
('Fritura por Imersão'),
('Marinadas e Temperos'),
('Molhos de Base'),
('Uso de Panela de Pressão');

ALTER TABLE alunos ADD COLUMN eh_admin BOOLEAN DEFAULT false;

ALTER TABLE alunos ADD COLUMN eh_admin BOOLEAN DEFAULT false;

INSERT INTO alunos (nome, email, senha, eh_admin) 
VALUES ('Thiago', 'thiago@utfpr.edu.br', '1234', true);

ALTER TABLE receitas ADD COLUMN midia_url TEXT;

-- Tabela de relacionamento: Receitas e Categorias (N para N)
CREATE TABLE IF NOT EXISTS receita_categorias (
    receita_id INTEGER REFERENCES receitas(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (receita_id, categoria_id)
);

-- Tabela de relacionamento: Receitas e Autores/Alunos (N para N)
CREATE TABLE IF NOT EXISTS receita_autores (
    receita_id INTEGER REFERENCES receitas(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    PRIMARY KEY (receita_id, aluno_id)
);

CREATE TABLE IF NOT EXISTS aluno_habilidades (
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    habilidade_id INTEGER REFERENCES habilidades(id) ON DELETE CASCADE,
    nivel INTEGER CHECK (nivel >= 0 AND nivel <= 10),
    PRIMARY KEY (aluno_id, habilidade_id)
);