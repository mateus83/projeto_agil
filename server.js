const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('projeto_agil.db');

// Rota de login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).send('Erro no servidor');
        if (!user || !bcrypt.compareSync(password, user.senha)) {
            return res.status(401).send('Email ou senha incorretos');
        }
        const token = jwt.sign({ id: user.id, cargo: user.cargo }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Rota de logout
app.post('/api/auth/logout', (req, res) => {
    res.sendStatus(200);
});

// Rota para verificar autenticação
app.get('/api/auth/check', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Token não fornecido');
    jwt.verify(token,
    SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        db.get('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (err, user) => {
            if (err) return res.status(500).send('Erro no servidor');
            if (!user) return res.status(404).send('Usuário não encontrado');
            res.json({ id: user.id, nome: user.nome, cargo: user.cargo, nivel_acesso: user.nivel_acesso });
        });
    });
});

// Rota para obter dados do dashboard
app.get('/api/dashboard', (req, res) => {
    const dashboardData = {};

    db.get('SELECT COUNT(*) AS totalProjects FROM projetos', [], (err, row) => {
        if (err) return res.status(500).send('Erro no servidor');
        dashboardData.totalProjects = row.totalProjects;

        db.get('SELECT COUNT(*) AS totalTasks FROM tarefas', [], (err, row) => {
            if (err) return res.status(500).send('Erro no servidor');
            dashboardData.totalTasks = row.totalTasks;

            db.get('SELECT COUNT(*) AS completedTasks FROM tarefas WHERE status = "Concluída"', [], (err, row) => {
                if (err) return res.status(500).send('Erro no servidor');
                dashboardData.completedTasks = row.completedTasks;

                res.json(dashboardData);
            });
        });
    });
});

// Rota para obter projetos
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projetos', [], (err, projects) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.json(projects);
    });
});

// Rota para obter tarefas
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tarefas', [], (err, tasks) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.json(tasks);
    });
});

// Rota para obter subtarefas de uma tarefa específica
app.get('/api/tasks/:id/subtasks', (req, res) => {
    const { id } = req.params;
    db.all('SELECT * FROM subtarefas WHERE tarefa_id = ?', [id], (err, subtasks) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.json(subtasks);
    });
});

// Rota para criar subtarefas
app.post('/api/tasks/:id/subtasks', (req, res) => {
    const { id } = req.params;
    const { titulo, status } = req.body;
    db.run('INSERT INTO subtarefas (titulo, tarefa_id, status) VALUES (?, ?, ?)', [titulo, id, status], (err) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.sendStatus(201);
    });
});

// Rota para atualizar subtarefas
app.put('/api/subtasks/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, status } = req.body;
    db.run('UPDATE subtarefas SET titulo = ?, status = ? WHERE id = ?', [titulo, status, id], (err) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.sendStatus(200);
    });
});

// Rota para excluir subtarefas
app.delete('/api/subtasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM subtarefas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.sendStatus(200);
    });
});

// Rota para obter membros da equipe
app.get('/api/team', (req, res) => {
    db.all('SELECT * FROM usuarios', [], (err, team) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.json(team);
    });
});

// Rota para editar cargos dos membros da equipe
app.put('/api/team/:id', (req, res) => {
    const { id } = req.params;
    const { cargo } = req.body;
    db.run('UPDATE usuarios SET cargo = ? WHERE id = ?', [cargo, id], (err) => {
        if (err) return res.status(500).send('Erro no servidor');
        res.sendStatus(200);
    });
});

// Rota para obter dados dos relatórios
app.get('/api/reports', (req, res) => {
    const reportData = {};

    db.all('SELECT nome, progresso FROM projetos', [], (err, projects) => {
        if (err) return res.status(500).send('Erro no servidor');
        reportData.projectNames = projects.map(project => project.nome);
        reportData.projectProgress = projects.map(project => project.progresso);

        db.all('SELECT status, COUNT(*) AS count FROM tarefas GROUP BY status', [], (err, tasks) => {
            if (err) return res.status(500).send('Erro no servidor');
            reportData.taskDistribution = tasks.map(task => task.count);
            res.json(reportData);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
