/* =========================================================
   ACESSIBILIDADE - VOZATIVA
========================================================= */

(function () {

    /* =====================================================
       CRIAR O PAINEL
    ===================================================== */

    function criarAcessibilidade() {

        /* Evita criar duas vezes */
        if (document.getElementById("botaoAcessibilidade")) {
            return;
        }

        /* Botão */
        const botao = document.createElement("button");

        botao.id = "botaoAcessibilidade";
        botao.setAttribute("aria-label", "Abrir opções de acessibilidade");
        botao.setAttribute("title", "Acessibilidade");

        botao.innerHTML = "♿";

        document.body.appendChild(botao);


        /* Painel */
        const painel = document.createElement("div");

        painel.id = "acessibilidadePainel";

        painel.setAttribute("aria-label", "Opções de acessibilidade");

        painel.innerHTML = `

            <h2>♿ Acessibilidade</h2>

            <button
                class="acessibilidade-opcao"
                id="aumentarFonte">
                🔠 Aumentar texto
            </button>

            <button
                class="acessibilidade-opcao"
                id="diminuirFonte">
                🔡 Diminuir texto
            </button>

            <button
                class="acessibilidade-opcao"
                id="fonteNormal">
                ↺ Tamanho normal
            </button>

            <div class="acessibilidade-separador"></div>

            <button
                class="acessibilidade-opcao"
                id="lerSelecao">
                🔊 Ler texto selecionado
            </button>

            <button
                class="acessibilidade-opcao"
                id="lerMouse">
                🖱️ Ler ao passar o mouse
            </button>

            <button
                class="acessibilidade-opcao"
                id="pararLeitura">
                ⏹️ Parar leitura
            </button>

            <div class="acessibilidade-separador"></div>

            <button
                class="acessibilidade-opcao"
                id="altoContraste">
                ◐ Alto contraste
            </button>

            <div class="acessibilidade-info">
                Selecione um texto para ouvi-lo em voz alta.
                Você também pode ativar a leitura ao passar
                o mouse sobre os textos.
            </div>

        `;

        document.body.appendChild(painel);


        /* =================================================
           ABRIR / FECHAR PAINEL
        ================================================= */

        botao.addEventListener("click", function () {

            painel.classList.toggle("aberto");

        });


        /* =================================================
           AUMENTAR FONTE
        ================================================= */

        document
            .getElementById("aumentarFonte")
            .addEventListener("click", function () {

                document.body.classList.remove(
                    "acessibilidade-fonte-normal",
                    "acessibilidade-fonte-grande"
                );

                document.body.classList.add(
                    "acessibilidade-fonte-maior"
                );

                localStorage.setItem(
                    "tamanhoFonte",
                    "maior"
                );

            });


        /* =================================================
           DIMINUIR FONTE
        ================================================= */

        document
            .getElementById("diminuirFonte")
            .addEventListener("click", function () {

                document.body.classList.remove(
                    "acessibilidade-fonte-maior",
                    "acessibilidade-fonte-normal"
                );

                document.body.classList.add(
                    "acessibilidade-fonte-grande"
                );

                localStorage.setItem(
                    "tamanhoFonte",
                    "grande"
                );

            });


        /* =================================================
           FONTE NORMAL
        ================================================= */

        document
            .getElementById("fonteNormal")
            .addEventListener("click", function () {

                document.body.classList.remove(
                    "acessibilidade-fonte-grande",
                    "acessibilidade-fonte-maior"
                );

                document.body.classList.add(
                    "acessibilidade-fonte-normal"
                );

                localStorage.setItem(
                    "tamanhoFonte",
                    "normal"
                );

            });


        /* =================================================
           LEITURA DE TEXTO SELECIONADO
        ================================================= */

        document
            .getElementById("lerSelecao")
            .addEventListener("click", function () {

                lerTextoSelecionado();

            });


        /* =================================================
           LEITURA AO PASSAR O MOUSE
        ================================================= */

        document
            .getElementById("lerMouse")
            .addEventListener("click", function () {

                const botaoLeitura =
                    document.getElementById("lerMouse");

                const ativo =
                    localStorage.getItem("leituraMouse") === "true";

                if (ativo) {

                    localStorage.setItem(
                        "leituraMouse",
                        "false"
                    );

                    botaoLeitura.classList.remove("ativo");

                    removerLeituraMouse();

                } else {

                    localStorage.setItem(
                        "leituraMouse",
                        "true"
                    );

                    botaoLeitura.classList.add("ativo");

                    ativarLeituraMouse();

                }

            });


        /* =================================================
           PARAR LEITURA
        ================================================= */

        document
            .getElementById("pararLeitura")
            .addEventListener("click", function () {

                pararLeitura();

            });


        /* =================================================
           ALTO CONTRASTE
        ================================================= */

        document
            .getElementById("altoContraste")
            .addEventListener("click", function () {

                const ativo =
                    localStorage.getItem("altoContraste") === "true";

                if (ativo) {

                    document.body.classList.remove(
                        "alto-contraste"
                    );

                    localStorage.setItem(
                        "altoContraste",
                        "false"
                    );

                    this.classList.remove("ativo");

                } else {

                    document.body.classList.add(
                        "alto-contraste"
                    );

                    localStorage.setItem(
                        "altoContraste",
                        "true"
                    );

                    this.classList.add("ativo");

                }

            });


        /* =================================================
           CARREGAR CONFIGURAÇÕES SALVAS
        ================================================= */

        carregarConfiguracoes();

    }


    /* =====================================================
       LER TEXTO SELECIONADO
    ===================================================== */

    function lerTextoSelecionado() {

        const selecao =
            window.getSelection().toString().trim();

        if (!selecao) {

            alert(
                "Selecione um texto na página para que ele seja lido."
            );

            return;
        }

        falar(selecao);

    }


    /* =====================================================
       FUNÇÃO PRINCIPAL DE VOZ
    ===================================================== */

    function falar(texto) {

        if (!("speechSynthesis" in window)) {

            alert(
                "Seu navegador não oferece suporte à leitura em voz alta."
            );

            return;
        }

        speechSynthesis.cancel();

        const fala =
            new SpeechSynthesisUtterance(texto);

        fala.lang = "pt-BR";

        fala.rate = 1;

        fala.pitch = 1;

        fala.volume = 1;

        speechSynthesis.speak(fala);

    }


    /* =====================================================
       PARAR LEITURA
    ===================================================== */

    function pararLeitura() {

        if ("speechSynthesis" in window) {

            speechSynthesis.cancel();

        }

    }


    /* =====================================================
       ELEMENTOS QUE PODEM SER LIDOS
    ===================================================== */

    function elementoPodeSerLido(elemento) {

        if (!elemento) {
            return false;
        }

        const tagsPermitidas = [
            "P",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "LI",
            "BUTTON",
            "A",
            "LABEL",
            "SPAN",
            "STRONG",
            "B",
            "EM",
            "TD",
            "TH",
            "ARTICLE"
        ];

        if (!tagsPermitidas.includes(elemento.tagName)) {
            return false;
        }

        /* Não ler o próprio painel de acessibilidade */
        if (
            elemento.closest("#acessibilidadePainel") ||
            elemento.closest("#botaoAcessibilidade")
        ) {
            return false;
        }

        const texto =
            elemento.innerText?.trim();

        if (!texto) {
            return false;
        }

        return true;

    }


    /* =====================================================
       LEITURA AO PASSAR O MOUSE
    ===================================================== */

    function ativarLeituraMouse() {

        if (window.acessibilidadeMouseAtiva) {
            return;
        }

        window.acessibilidadeMouseAtiva = true;

        document.addEventListener(
            "mouseover",
            leituraMouseHandler
        );

    }


    function removerLeituraMouse() {

        window.acessibilidadeMouseAtiva = false;

        document.removeEventListener(
            "mouseover",
            leituraMouseHandler
        );

    }


    function leituraMouseHandler(event) {

        const elemento =
            event.target.closest(
                "p, h1, h2, h3, h4, h5, h6, li, button, a, label, span, strong, b, em, td, th, article"
            );

        if (!elemento) {
            return;
        }

        if (!elementoPodeSerLido(elemento)) {
            return;
        }

        /* Evita ler novamente o mesmo elemento */
        if (
            window.ultimoElementoLido === elemento
        ) {
            return;
        }

        window.ultimoElementoLido = elemento;

        const texto =
            elemento.innerText.trim();

        /* Limita textos gigantes */
        if (texto.length > 500) {
            return;
        }

        document
            .querySelectorAll(".elemento-sendo-lido")
            .forEach(function (item) {

                item.classList.remove(
                    "elemento-sendo-lido"
                );

            });

        elemento.classList.add(
            "elemento-sendo-lido"
        );

        falar(texto);

    }


    /* =====================================================
       CONFIGURAÇÕES SALVAS
    ===================================================== */

    function carregarConfiguracoes() {

        /* Tamanho */
        const tamanho =
            localStorage.getItem("tamanhoFonte");

        if (tamanho === "normal") {

            document.body.classList.add(
                "acessibilidade-fonte-normal"
            );

        }

        if (tamanho === "grande") {

            document.body.classList.add(
                "acessibilidade-fonte-grande"
            );

        }

        if (tamanho === "maior") {

            document.body.classList.add(
                "acessibilidade-fonte-maior"
            );

        }


        /* Alto contraste */
        const contraste =
            localStorage.getItem("altoContraste");

        if (contraste === "true") {

            document.body.classList.add(
                "alto-contraste"
            );

            const botaoContraste =
                document.getElementById("altoContraste");

            if (botaoContraste) {
                botaoContraste.classList.add("ativo");
            }

        }


        /* Leitura do mouse */
        const leituraMouse =
            localStorage.getItem("leituraMouse");

        if (leituraMouse === "true") {

            const botaoLeitura =
                document.getElementById("lerMouse");

            if (botaoLeitura) {

                botaoLeitura.classList.add("ativo");

            }

            ativarLeituraMouse();

        }

    }


    /* =====================================================
       INICIAR
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            criarAcessibilidade
        );

    } else {

        criarAcessibilidade();

    }

})();