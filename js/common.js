const EXTERNAL_PAGES = {
    noticias: 'noticias.html',
    denuncias: 'denuncias.html',
    mapa: 'mapa.html',
    chat: 'assistente.html'
};

function navigateTo(page) {

    const current = document.body.dataset.page || 'home';

    if (EXTERNAL_PAGES[page]) {

        if (current !== page) {
            window.location.replace(EXTERNAL_PAGES[page]);
        }

        closeMoreMenu();
        return;
    }

    if (page === 'home') {

        if (current === 'home') {
            go('home');
        } else {
            window.location.replace('index.html');
        }

        closeMoreMenu();
        return;
    }

    if (current === 'home') {
        go(page);
    } else {
        window.location.replace('index.html#' + page);
    }

    closeMoreMenu();
}


function go(page) {

    const pages = document.querySelectorAll('.page');

    pages.forEach(function (p) {
        p.classList.add('hidden');
    });

    const targetPage = document.getElementById('page-' + page);

    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    document
        .querySelectorAll('.nav-links button[data-page]')
        .forEach(function (button) {

            button.classList.toggle(
                'active',
                button.dataset.page === page
            );

        });

    closeMoreMenu();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


document.addEventListener('DOMContentLoaded', function () {

    if (document.body.dataset.page === 'home') {

        const hash = window.location.hash.replace('#', '');

        if (hash) {
            go(hash);
        }
    }

});


/* =========================================================
   MENU "MAIS"
========================================================= */

function toggleMore(event) {

    if (event) {
        event.stopPropagation();
    }

    const menu = document.getElementById('moreMenu');

    if (!menu) {
        return;
    }

    menu.classList.toggle('hidden');
}


function closeMoreMenu() {

    const menu = document.getElementById('moreMenu');

    if (menu) {
        menu.classList.add('hidden');
    }
}


document.addEventListener('click', function () {
    closeMoreMenu();
});


/* =========================================================
   DESTACAR BOTÃO ATIVO
========================================================= */

function highlightMainNav() {

    const current =
        document.body.dataset.page || 'home';

    document
        .querySelectorAll('.nav-links > [data-page]')
        .forEach(function (button) {

            button.classList.toggle(
                'active',
                button.dataset.page === current
            );

        });
}


document.addEventListener(
    'DOMContentLoaded',
    highlightMainNav
);


/* =========================================================
   SAÍDA RÁPIDA
========================================================= */

const EXIT_URL =
    'https://www.google.com/search?q=previsão+do+tempo';

const EXIT_SIGNAL_KEY =
    'vozativa-quick-exit';

let exitChannel = null;


try {

    if ('BroadcastChannel' in window) {

        exitChannel =
            new BroadcastChannel(
                'vozativa-quick-exit'
            );

        exitChannel.onmessage = function (event) {

            if (event.data === 'exit') {
                leaveNow();
            }

        };

    }

} catch (e) {

    exitChannel = null;

}


function leaveNow() {

    window.location.replace(EXIT_URL);

}


function quickExit() {

    try {

        if (exitChannel) {

            exitChannel.postMessage('exit');

        } else if (window.localStorage) {

            localStorage.setItem(
                EXIT_SIGNAL_KEY,
                String(Date.now())
            );

        }

    } catch (e) {
        // Continua mesmo se houver erro
    }

    leaveNow();
}


window.addEventListener(
    'storage',
    function (event) {

        if (
            event.key === EXIT_SIGNAL_KEY &&
            event.newValue
        ) {

            leaveNow();

        }

    }
);


/* =========================================================
   ESC = SAÍDA RÁPIDA
========================================================= */

document.addEventListener(
    'keydown',
    function (event) {

        const activeElement =
            document.activeElement;

        const isTyping =
            activeElement &&
            (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable
            );

        if (
            event.key === 'Escape' &&
            !isTyping
        ) {

            quickExit();

        }

    }
);


/* =========================================================
   MODAIS
========================================================= */

function openEmergency() {

    const modal =
        document.getElementById(
            'emergencyModal'
        );

    if (modal) {
        modal.classList.remove('hidden');
    }

}


function openLogin() {

    const modal =
        document.getElementById(
            'loginModal'
        );

    if (modal) {
        modal.classList.remove('hidden');
    }

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.add('hidden');
    }

}


document.addEventListener(
    'click',
    function (event) {

        if (
            !event.target.classList.contains(
                'modal-overlay'
            )
        ) {

            return;

        }

        event.target.classList.add('hidden');

    }
);


/* =========================================================
   TEMA CLARO / ESCURO
========================================================= */

function toggleTheme() {

    const html =
        document.documentElement;

    const themeButton =
        document.getElementById(
            'themeBtn'
        );

    if (!html) {
        return;
    }

    const isDark =
        html.getAttribute('data-theme') === 'dark';

    const newTheme =
        isDark ? 'light' : 'dark';

    html.setAttribute(
        'data-theme',
        newTheme
    );

    if (themeButton) {

        themeButton.textContent =
            newTheme === 'dark'
                ? '◑'
                : '◐';

    }

    localStorage.setItem(
        'theme',
        newTheme
    );

}


document.addEventListener(
    'DOMContentLoaded',
    function () {

        const savedTheme =
            localStorage.getItem('theme');

        const html =
            document.documentElement;

        const themeButton =
            document.getElementById(
                'themeBtn'
            );

        if (!savedTheme) {
            return;
        }

        html.setAttribute(
            'data-theme',
            savedTheme
        );

        if (themeButton) {

            themeButton.textContent =
                savedTheme === 'dark'
                    ? '◑'
                    : '◐';

        }

    }
);


/* =========================================================
   LOGIN E CADASTRO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const btnMostrarCadastro =
        document.getElementById("btnMostrarCadastro");

    const btnMostrarLogin =
        document.getElementById("btnMostrarLogin");

    const telaLogin =
        document.getElementById("telaLogin");

    const telaCadastro =
        document.getElementById("telaCadastro");


    /* =====================================================
       BOTÃO CADASTRE-SE
    ===================================================== */

    btnMostrarCadastro.addEventListener("click", function () {

        telaLogin.classList.add("hidden");

        telaCadastro.classList.remove("hidden");

    });


    /* =====================================================
       BOTÃO ENTRAR DA TELA DE CADASTRO
    ===================================================== */

    btnMostrarLogin.addEventListener("click", function () {

        telaCadastro.classList.add("hidden");

        telaLogin.classList.remove("hidden");

    });

});

/* =========================================================
   CADASTRO
========================================================= */

const btnCadastrar =
    document.getElementById("btnCadastrar");


if (btnCadastrar) {

    btnCadastrar.addEventListener("click", function () {

        const nome =
            document.getElementById("cadastroNome").value.trim();

        const email =
            document.getElementById("cadastroEmail").value.trim();

        const senha =
            document.getElementById("cadastroSenha").value;

        const confirmacao =
            document.getElementById("cadastroSenhaConfirmacao").value;


        /* Verificar se está tudo preenchido */

        if (!nome || !email || !senha || !confirmacao) {

            alert("Preencha todos os campos.");

            return;
        }


        /* Verificar se as senhas são iguais */

        if (senha !== confirmacao) {

            alert("As senhas não são iguais.");

            return;
        }


        /* Verificar tamanho da senha */

        if (senha.length < 6) {

            alert("A senha precisa ter pelo menos 6 caracteres.");

            return;
        }


        alert("Cadastro realizado com sucesso!");

    });

}