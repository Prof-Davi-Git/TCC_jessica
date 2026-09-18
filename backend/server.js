// ATUALIZAÇÃO 18/09/2026 - servidor de cadastro e login
require('dotenv').config({ quiet: true });

const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const pastaSite = path.join(__dirname, '..');

app.disable('x-powered-by');

app.use(cors({
    origin(origin, callback) {
        const origemLocal = !origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

        if (origemLocal) {
            callback(null, true);
            return;
        }

        callback(new Error('Origem não permitida.'));
    },
    credentials: true
}));

app.use(express.json({ limit: '20kb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'vozativa-chave-local-trocar',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    }
}));

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/cadastro', async (req, res) => {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');

    if (nome.length < 2 || nome.length > 100) {
        return res.status(400).json({ mensagem: 'Informe um nome válido.' });
    }

    if (!emailValido(email) || email.length > 150) {
        return res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
    }

    if (senha.length < 6 || senha.length > 72) {
        return res.status(400).json({ mensagem: 'A senha deve ter entre 6 e 72 caracteres.' });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 12);

        await pool.execute(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );

        return res.status(201).json({ mensagem: 'Conta criada com sucesso.' });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
        }

        console.error('Erro no cadastro:', erro.message);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar. Tente novamente.' });
    }
});

app.post('/api/login', async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha e-mail e senha.' });
    }

    try {
        const [usuarios] = await pool.execute(
            'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ? LIMIT 1',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        }

        const usuario = usuarios[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        }

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        return res.json({
            mensagem: 'Login realizado com sucesso.',
            usuario: req.session.usuario
        });
    } catch (erro) {
        console.error('Erro no login:', erro.message);
        return res.status(500).json({ mensagem: 'Erro ao entrar. Tente novamente.' });
    }
});

app.get('/api/sessao', (req, res) => {
    res.json({ usuario: req.session.usuario || null });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ mensagem: 'Sessão encerrada.' });
    });
});

app.use(express.static(pastaSite, { dotfiles: 'ignore' }));

async function iniciarServidor() {
    try {
        await pool.query('SELECT 1');
        app.listen(PORT, () => {
            console.log(`VozAtiva disponível em http://localhost:${PORT}`);
        });
    } catch (erro) {
        console.error('Não foi possível conectar ao MySQL.');
        console.error('Confira o arquivo backend/.env e se o MySQL está iniciado.');
        console.error(erro.message);
        process.exit(1);
    }
}

if (require.main === module) {
    iniciarServidor();
}

module.exports = { app, iniciarServidor };
