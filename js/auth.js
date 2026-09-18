/* =========================================================
   ATUALIZAÇÃO 18/09/2026 - LOGIN E CADASTRO COM MYSQL
========================================================= */

const AUTH_API_BASE = (() => {
    const hostLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

    if (hostLocal && window.location.port !== '3000') {
        return `http://${window.location.hostname}:3000`;
    }

    return '';
})();

let usuarioLogado = null;

function mensagemAutenticacao(elemento, texto, tipo = '') {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = `auth-status ${tipo}`.trim();
}

function mostrarTelaAutenticacao(tela) {
    const telaLogin = document.getElementById('telaLogin');
    const telaCadastro = document.getElementById('telaCadastro');

    if (!telaLogin || !telaCadastro) return;

    telaLogin.classList.toggle('hidden', tela !== 'login');
    telaCadastro.classList.toggle('hidden', tela !== 'cadastro');
}

function montarModalAutenticacao() {
    const modal = document.getElementById('loginModal');

    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-box auth-modal" role="dialog" aria-modal="true" aria-labelledby="authTitulo">
            <button class="auth-close" type="button" aria-label="Fechar" onclick="closeModal('loginModal')">×</button>

            <div id="telaLogin">
                <h3 id="authTitulo">Entrar</h3>
                <p>Entre na sua conta do VozAtiva.</p>

                <form id="formLogin">
                    <div class="form-row">
                        <label for="loginEmail">E-mail</label>
                        <input id="loginEmail" name="email" type="email" autocomplete="email" required>
                    </div>

                    <div class="form-row">
                        <label for="loginSenha">Senha</label>
                        <input id="loginSenha" name="senha" type="password" autocomplete="current-password" minlength="6" required>
                    </div>

                    <div id="loginStatus" class="auth-status" aria-live="polite"></div>

                    <button id="btnEntrar" class="modal-close auth-submit" type="submit">Entrar</button>
                </form>

                <p class="trocar-tela">
                    Ainda não tem uma conta?
                    <button id="btnMostrarCadastro" class="auth-link" type="button">Cadastre-se</button>
                </p>
            </div>

            <div id="telaCadastro" class="hidden">
                <h3>Criar conta</h3>
                <p>Preencha os dados abaixo para se cadastrar.</p>

                <form id="formCadastro">
                    <div class="form-row">
                        <label for="cadastroNome">Nome</label>
                        <input id="cadastroNome" name="nome" type="text" autocomplete="name" maxlength="100" required>
                    </div>

                    <div class="form-row">
                        <label for="cadastroEmail">E-mail</label>
                        <input id="cadastroEmail" name="email" type="email" autocomplete="email" required>
                    </div>

                    <div class="form-row">
                        <label for="cadastroSenha">Senha</label>
                        <input id="cadastroSenha" name="senha" type="password" autocomplete="new-password" minlength="6" required>
                    </div>

                    <div class="form-row">
                        <label for="cadastroSenhaConfirmacao">Confirmar senha</label>
                        <input id="cadastroSenhaConfirmacao" name="confirmacao" type="password" autocomplete="new-password" minlength="6" required>
                    </div>

                    <div id="cadastroStatus" class="auth-status" aria-live="polite"></div>

                    <button id="btnCadastrar" class="modal-close auth-submit" type="submit">Criar conta</button>
                </form>

                <p class="trocar-tela">
                    Já tem uma conta?
                    <button id="btnMostrarLogin" class="auth-link" type="button">Entrar</button>
                </p>
            </div>
        </div>
    `;

    document.getElementById('btnMostrarCadastro').addEventListener('click', () => {
        mostrarTelaAutenticacao('cadastro');
    });

    document.getElementById('btnMostrarLogin').addEventListener('click', () => {
        mostrarTelaAutenticacao('login');
    });

    document.getElementById('formLogin').addEventListener('submit', fazerLogin);
    document.getElementById('formCadastro').addEventListener('submit', fazerCadastro);
}

async function chamarApi(caminho, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${AUTH_API_BASE}${caminho}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(opcoes.headers || {})
            },
            ...opcoes
        });
    } catch (erro) {
        throw new Error('Servidor indisponível. Inicie o backend do VozAtiva.');
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
    }

    return dados;
}

async function fazerCadastro(event) {
    event.preventDefault();

    const status = document.getElementById('cadastroStatus');
    const botao = document.getElementById('btnCadastrar');
    const nome = document.getElementById('cadastroNome').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value;
    const confirmacao = document.getElementById('cadastroSenhaConfirmacao').value;

    if (senha !== confirmacao) {
        mensagemAutenticacao(status, 'As senhas não são iguais.', 'erro');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Cadastrando...';
    mensagemAutenticacao(status, '');

    try {
        await chamarApi('/api/cadastro', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha })
        });

        document.getElementById('formCadastro').reset();
        mostrarTelaAutenticacao('login');
        document.getElementById('loginEmail').value = email;
        mensagemAutenticacao(
            document.getElementById('loginStatus'),
            'Conta criada! Agora entre com a sua senha.',
            'sucesso'
        );
    } catch (erro) {
        mensagemAutenticacao(status, erro.message, 'erro');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Criar conta';
    }
}

async function fazerLogin(event) {
    event.preventDefault();

    const status = document.getElementById('loginStatus');
    const botao = document.getElementById('btnEntrar');
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    botao.disabled = true;
    botao.textContent = 'Entrando...';
    mensagemAutenticacao(status, '');

    try {
        const dados = await chamarApi('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        usuarioLogado = dados.usuario;
        atualizarBotaoUsuario();
        document.getElementById('formLogin').reset();
        closeModal('loginModal');
    } catch (erro) {
        mensagemAutenticacao(status, erro.message, 'erro');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Entrar';
    }
}

async function verificarSessao() {
    try {
        const dados = await chamarApi('/api/sessao');
        usuarioLogado = dados.usuario || null;
        atualizarBotaoUsuario();
    } catch (erro) {
        usuarioLogado = null;
        atualizarBotaoUsuario();
    }
}

async function fazerLogout() {
    try {
        await chamarApi('/api/logout', { method: 'POST' });
    } catch (erro) {
        // Mesmo se o servidor já tiver encerrado a sessão, a interface volta ao estado inicial.
    }

    usuarioLogado = null;
    atualizarBotaoUsuario();
}

function atualizarBotaoUsuario() {
    document.querySelectorAll('.login-btn').forEach((botao) => {
        if (usuarioLogado) {
            const primeiroNome = usuarioLogado.nome.split(' ')[0];
            botao.textContent = `${primeiroNome} · Sair`;
            botao.setAttribute('aria-label', 'Sair da conta');
        } else {
            botao.textContent = 'Entrar';
            botao.setAttribute('aria-label', 'Entrar na conta');
        }
    });
}

window.openLogin = function () {
    if (usuarioLogado) {
        fazerLogout();
        return;
    }

    mostrarTelaAutenticacao('login');
    const modal = document.getElementById('loginModal');

    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => document.getElementById('loginEmail')?.focus(), 0);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    montarModalAutenticacao();
    verificarSessao();
});
