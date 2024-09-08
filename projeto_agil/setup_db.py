import sqlite3

# Conectar ao banco de dados (ou criar se não existir)
conn = sqlite3.connect('projeto_agil.db')
cursor = conn.cursor()

# Criar tabela de usuários
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    nivel_acesso TEXT NOT NULL,
    cargo TEXT
)
''')

# Criar tabela de projetos
cursor.execute('''
CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    status TEXT NOT NULL,
    progresso INTEGER NOT NULL
)
''')

# Criar tabela de tarefas
cursor.execute('''
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    projeto_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    prazo DATE NOT NULL,
    FOREIGN KEY (projeto_id) REFERENCES projetos (id)
)
''')

# Criar tabela de subtarefas
cursor.execute('''
CREATE TABLE IF NOT EXISTS subtarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tarefa_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas (id)
)
''')

# Criar tabela de membros da equipe
cursor.execute('''
CREATE TABLE IF NOT EXISTS equipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cargo TEXT NOT NULL,
    projetos TEXT NOT NULL
)
''')

# Salvar as alterações e fechar a conexão
conn.commit()
conn.close()

print("Banco de dados configurado com sucesso!")
