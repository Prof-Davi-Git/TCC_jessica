/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const NEWS_API_URL =
    "https://script.google.com/macros/s/AKfycbwB4pHhHGYlUqI2_QhKEBqWJbJIo0W2NiCJBIDBemJm9GFsMk3L_gwcB1ED3VZrJfOH/exec";


/* =========================================================
   NOTÍCIAS
========================================================= */

let news = [];


/* =========================================================
   CARREGAR NOTÍCIAS
========================================================= */

async function loadNews() {

    const newsGrid =
        document.getElementById("newsGrid");


    if (!newsGrid) return;


    newsGrid.innerHTML = `
        <p class="news-loading">
            Carregando notícias...
        </p>
    `;


    try {

        const response =
            await fetch(
                NEWS_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao acessar as notícias."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Erro ao carregar notícias."
            );

        }


        news =
            data.news || [];


        if (news.length === 0) {

            newsGrid.innerHTML = `
                <div class="card news-card">

                    <div class="news-body">

                        <h4>
                            Nenhuma notícia encontrada
                        </h4>

                        <p>
                            Não encontramos uma notícia relacionada
                            ao tema no momento.
                        </p>

                    </div>

                </div>
            `;

            return;

        }


        renderNews();


    } catch (error) {

        console.error(
            "Erro:",
            error
        );


        newsGrid.innerHTML = `
            <div class="card news-card">

                <div class="news-body">

                    <h4>
                        Não foi possível carregar as notícias
                    </h4>

                    <p>
                        Tente novamente mais tarde.
                    </p>

                    <button
                        class="chip-btn"
                        type="button"
                        onclick="loadNews()"
                    >
                        Tentar novamente
                    </button>

                </div>

            </div>
        `;

    }

}


/* =========================================================
   RENDERIZAR NOTÍCIAS
========================================================= */

function renderNews() {

    const newsGrid =
        document.getElementById("newsGrid");


    if (!newsGrid) return;


    newsGrid.innerHTML =
        news.map(
            function (item, index) {

                return `

                    <div class="card news-card">

                        <div class="news-thumb">

                            ${
                                item.image
                                ?
                                `
                                    <img
                                        src="${escapeHtml(item.image)}"
                                        alt="${escapeHtml(item.title)}"
                                        onerror="this.parentElement.innerHTML='<div class=&quot;news-no-image&quot;>VozAtiva</div>';"
                                    >
                                `
                                :
                                `
                                    <div class="news-no-image">
                                        VozAtiva
                                    </div>
                                `
                            }

                        </div>


                        <div class="news-body">

                            <div class="news-meta">
                                ${escapeHtml(
                                    formatarData(item.date)
                                )}
                            </div>


                            <h4>
                                ${escapeHtml(item.title)}
                            </h4>


                            <p>
                                ${escapeHtml(item.text)}
                            </p>


                            <div class="news-actions">

                                <a
                                    class="chip-btn"
                                    href="${escapeHtml(item.link)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ler notícia completa ↗
                                </a>


                                <button
                                    class="chip-btn"
                                    type="button"
                                    onclick="shareNews(${index})"
                                >
                                    ↗ Compartilhar
                                </button>

                            </div>


                            <div class="news-source">

                                Fonte:
                                <strong>
                                    ${escapeHtml(
                                        item.source ||
                                        "Fonte original"
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

    if (!data) {

        return "Notícia recente";

    }


    const dataObj =
        new Date(data);


    if (
        isNaN(
            dataObj.getTime()
        )
    ) {

        return "Notícia recente";

    }


    return (
        "NACIONAL · " +
        dataObj.toLocaleDateString(
            "pt-BR"
        )
    );

}


/* =========================================================
   COMPARTILHAR
========================================================= */

function shareNews(index) {

    const item =
        news[index];


    if (!item) return;


    const text =
        `${item.title}\n\n${item.text}`;


    if (navigator.share) {

        navigator.share({

            title:
                item.title,

            text:
                text,

            url:
                item.link

        }).catch(
            function () {}
        );


        return;

    }


    if (navigator.clipboard) {

        navigator.clipboard
            .writeText(
                `${text}\n\n${item.link}`
            )

            .then(
                function () {

                    alert(
                        "Link da notícia copiado!"
                    );

                }
            )

            .catch(
                function () {

                    alert(
                        "Não foi possível copiar a notícia."
                    );

                }
            );


        return;

    }


    alert(
        "Não foi possível compartilhar a notícia."
    );

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadNews();

    }
);