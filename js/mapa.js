// ============================================================
// MAPA - VOZATIVA
// Google Maps + pesquisa + localização + marcadores
// ============================================================

let mapa;
let janelaInfo;
let marcadores = [];
let marcadorUsuario = null;

// Local usado como centro das pesquisas
let localAtual = null;

// Categoria atualmente selecionada
let categoriaAtual = "todos";

// ============================================================
// INICIALIZAÇÃO DO MAPA
// ============================================================

async function initMap() {

    try {

        // Importa as bibliotecas do Google Maps
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } =
            await google.maps.importLibrary("marker");

        // Local inicial: São Paulo
        const localInicial = {
            lat: -23.5505,
            lng: -46.6333
        };

        localAtual = localInicial;

        // Cria o mapa
        mapa = new Map(document.getElementById("map"), {
            center: localInicial,
            zoom: 13,

            mapId: "DEMO_MAP_ID",

            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        // Janela de informações
        janelaInfo = new google.maps.InfoWindow();

        atualizarStatus("Mapa carregado.");

        // Configura a barra de pesquisa
        configurarPesquisa();

        // Configura os botões
        configurarBotoes();

        // Tenta pegar a localização do usuário
        obterLocalizacaoInicial();

    } catch (erro) {

        console.error("Erro ao iniciar o mapa:", erro);

        atualizarStatus(
            "Não foi possível carregar o mapa. Verifique sua chave da API."
        );
    }
}


// ============================================================
// CONFIGURA A PESQUISA
// ============================================================

function configurarPesquisa() {

    const campo = document.getElementById("map-search");

    if (!campo) return;

    campo.addEventListener("keydown", function (evento) {

        if (evento.key === "Enter") {

            evento.preventDefault();

            buscarEndereco();
        }
    });
}


// ============================================================
// CONFIGURA OS BOTÕES
// ============================================================

function configurarBotoes() {

    const botaoDelegacias =
        document.getElementById("filter-police");

    const botaoHospitais =
        document.getElementById("filter-hospital");

    const botaoCRAS =
        document.getElementById("filter-cras");


    if (botaoDelegacias) {

        botaoDelegacias.onclick = function () {

            buscarTipo("police");
        };
    }


    if (botaoHospitais) {

        botaoHospitais.onclick = function () {

            buscarTipo("hospital");
        };
    }


    if (botaoCRAS) {

        botaoCRAS.onclick = function () {

            buscarTipo("cras");
        };
    }
}


// ============================================================
// LOCALIZAÇÃO INICIAL
// ============================================================

function obterLocalizacaoInicial() {

    if (!navigator.geolocation) {

        atualizarStatus(
            "Seu navegador não permite localização. Mostrando São Paulo."
        );

        buscarTodosServicos();

        return;
    }


    atualizarStatus(
        "Precisamos da sua localização para encontrar serviços próximos..."
    );


    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;


            localAtual = {
                lat: latitude,
                lng: longitude
            };


            mapa.setCenter(localAtual);

            mapa.setZoom(14);


            adicionarMarcadorUsuario(localAtual);


            atualizarStatus(
                "Localização encontrada. Procurando serviços próximos..."
            );


            buscarTodosServicos();
        },


        function (erro) {

            console.warn(
                "Não foi possível obter localização:",
                erro
            );


            atualizarStatus(
                "Localização não autorizada. Você pode pesquisar um local."
            );


            // Mesmo sem localização,
            // mostra serviços em São Paulo
            buscarTodosServicos();
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// ============================================================
// BOTÃO "USAR MINHA LOCALIZAÇÃO"
// ============================================================

function usarMinhaLocalizacao() {

    if (!navigator.geolocation) {

        atualizarStatus(
            "Seu navegador não suporta localização."
        );

        return;
    }


    atualizarStatus(
        "Obtendo sua localização..."
    );


    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;


            localAtual = {
                lat: latitude,
                lng: longitude
            };


            mapa.setCenter(localAtual);

            mapa.setZoom(14);


            adicionarMarcadorUsuario(localAtual);


            atualizarStatus(
                "Localização encontrada!"
            );


            // Busca os três tipos
            buscarTodosServicos();
        },


        function (erro) {

            console.error(erro);


            atualizarStatus(
                "Não foi possível obter sua localização. Verifique a permissão do navegador."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// ============================================================
// MARCADOR DO USUÁRIO
// ============================================================

function adicionarMarcadorUsuario(local) {

    if (!mapa) return;


    // Remove marcador anterior
    if (marcadorUsuario) {

        marcadorUsuario.map = null;

        marcadorUsuario = null;
    }


    const elemento = document.createElement("div");

    elemento.style.fontSize = "30px";

    elemento.innerHTML = "📍";


    marcadorUsuario =
        new google.maps.marker.AdvancedMarkerElement({

            map: mapa,

            position: local,

            title: "Você está aqui",

            content: elemento
        });


    marcadorUsuario.addListener(
        "click",
        function () {

            janelaInfo.setContent(
                "<strong>Você está aqui</strong>"
            );

            janelaInfo.open({
                map: mapa,
                anchor: marcadorUsuario
            });
        }
    );
}


// ============================================================
// PESQUISA DE ENDEREÇO / CIDADE / LOCAL
// ============================================================

async function buscarEndereco() {

    const campo =
        document.getElementById("map-search");


    if (!campo) return;


    const texto =
        campo.value.trim();


    if (!texto) {

        atualizarStatus(
            "Digite uma cidade, endereço ou local para pesquisar."
        );

        return;
    }


    if (!mapa) {

        atualizarStatus(
            "O mapa ainda está carregando."
        );

        return;
    }


    atualizarStatus(
        "Pesquisando: " + texto + "..."
    );


    try {

        const { Place } =
            await google.maps.importLibrary("places");


        const resposta =
            await Place.searchByText({

                textQuery: texto,

                fields: [
                    "displayName",
                    "formattedAddress",
                    "location",
                    "id"
                ],

                maxResultCount: 10,

                language: "pt-BR",

                region: "BR"
            });


        const resultados =
            resposta.places || [];


        if (resultados.length === 0) {

            atualizarStatus(
                "Nenhum resultado encontrado."
            );

            mostrarResultados([]);

            return;
        }


        // Primeiro resultado
        const primeiro =
            resultados[0];


        if (primeiro.location) {

            const latitude =
                primeiro.location.lat();

            const longitude =
                primeiro.location.lng();


            // IMPORTANTE:
            // Atualiza o local usado pelas próximas buscas
            localAtual = {
                lat: latitude,
                lng: longitude
            };


            mapa.setCenter(localAtual);

            mapa.setZoom(14);
        }


        // Remove marcadores antigos
        limparMarcadores();


        // Mostra o local pesquisado
        criarMarcador(
            primeiro,
            "local"
        );


        mostrarResultados(resultados);


        atualizarStatus(
            "Local encontrado! Procurando Delegacias, Hospitais e CRAS próximos..."
        );


        // ====================================================
        // AQUI ESTÁ A PARTE IMPORTANTE
        //
        // Depois que você pesquisa um local,
        // o mapa procura os serviços NAQUELA REGIÃO.
        // ====================================================

        await buscarTodosServicos();


    } catch (erro) {

        console.error(
            "Erro na pesquisa:",
            erro
        );


        atualizarStatus(
            "Erro ao pesquisar o local."
        );
    }
}


// ============================================================
// BUSCAR OS TRÊS TIPOS DE SERVIÇO
// ============================================================

async function buscarTodosServicos() {

    if (!localAtual) return;


    limparMarcadores();


    try {

        const resultados =
            await Promise.all([

                pesquisarServicos(
                    "police"
                ),

                pesquisarServicos(
                    "hospital"
                ),

                pesquisarServicos(
                    "cras"
                )

            ]);


        const delegacias =
            resultados[0];

        const hospitais =
            resultados[1];

        const cras =
            resultados[2];


        let quantidade = 0;


        // Delegacias
        delegacias.forEach(function (local) {

            criarMarcador(
                local,
                "police"
            );

            quantidade++;
        });


        // Hospitais
        hospitais.forEach(function (local) {

            criarMarcador(
                local,
                "hospital"
            );

            quantidade++;
        });


        // CRAS
        cras.forEach(function (local) {

            criarMarcador(
                local,
                "cras"
            );

            quantidade++;
        });


        mostrarResultadosServicos(
            delegacias,
            hospitais,
            cras
        );


        atualizarStatus(
            quantidade +
            " locais de atendimento encontrados próximos da região."
        );


    } catch (erro) {

        console.error(
            "Erro ao procurar serviços:",
            erro
        );


        atualizarStatus(
            "Não foi possível encontrar os serviços próximos."
        );
    }
}


// ============================================================
// PESQUISA DE SERVIÇOS
// ============================================================

async function pesquisarServicos(tipo) {

    const { Place } =
        await google.maps.importLibrary("places");


    let texto;


    switch (tipo) {

        case "police":

            texto =
                "Delegacia da Mulher";

            break;


        case "hospital":

            texto =
                "Hospital";

            break;


        case "cras":

            texto =
                "CRAS Centro de Referência de Assistência Social";

            break;


        default:

            texto =
                "serviços públicos";
    }


    try {

        const resposta =
            await Place.searchByText({

                textQuery: texto,

                fields: [
                    "displayName",
                    "formattedAddress",
                    "location",
                    "id"
                ],

                maxResultCount: 10,

                language: "pt-BR",

                region: "BR",

                locationBias: {

                    center: localAtual,

                    radius: 10000
                }
            });


        return resposta.places || [];


    } catch (erro) {

        console.error(
            "Erro procurando " + tipo + ":",
            erro
        );


        return [];
    }
}


// ============================================================
// FILTROS
// ============================================================

async function buscarTipo(tipo) {

    categoriaAtual = tipo;


    limparMarcadores();


    const nomes = {

        police:
            "Delegacias",

        hospital:
            "Hospitais",

        cras:
            "CRAS"
    };


    atualizarStatus(
        "Procurando " +
        nomes[tipo] +
        " próximos..."
    );


    try {

        const resultados =
            await pesquisarServicos(tipo);


        resultados.forEach(function (local) {

            criarMarcador(
                local,
                tipo
            );
        });


        mostrarListaCategoria(
            resultados,
            nomes[tipo]
        );


        atualizarStatus(

            resultados.length +
            " " +
            nomes[tipo].toLowerCase() +
            " encontrados."
        );


    } catch (erro) {

        console.error(erro);


        atualizarStatus(
            "Erro ao procurar " +
            nomes[tipo] +
            "."
        );
    }
}


// ============================================================
// CRIA MARCADOR
// ============================================================

function criarMarcador(local, tipo) {

    if (!mapa || !local.location) return;


    let emoji;


    switch (tipo) {

        case "police":

            emoji = "👮";

            break;


        case "hospital":

            emoji = "🏥";

            break;


        case "cras":

            emoji = "🏠";

            break;


        default:

            emoji = "📍";
    }


    // Cria elemento visual do marcador
    const elemento =
        document.createElement("div");


    elemento.style.fontSize =
        "28px";

    elemento.style.cursor =
        "pointer";

    elemento.textContent =
        emoji;


    const marcador =
        new google.maps.marker.AdvancedMarkerElement({

            map: mapa,

            position: local.location,

            title:
                local.displayName || "Local",

            content: elemento
        });


    // Salva referência
    marcadores.push(marcador);


    // Clique no marcador
    marcador.addListener(
        "click",
        function () {

            abrirInfoLocal(
                local,
                tipo,
                marcador
            );
        }
    );
}


// ============================================================
// JANELA DE INFORMAÇÕES
// ============================================================

function abrirInfoLocal(
    local,
    tipo,
    marcador
) {

    const nome =
        local.displayName ||
        "Local sem nome";


    const endereco =
        local.formattedAddress ||
        "Endereço não informado";


    let categoria;


    switch (tipo) {

        case "police":

            categoria =
                "🚔 Delegacia";

            break;


        case "hospital":

            categoria =
                "🏥 Hospital";

            break;


        case "cras":

            categoria =
                "🏠 CRAS";

            break;


        default:

            categoria =
                "📍 Local";
    }


    const urlGoogleMaps =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
            nome + " " + endereco
        );


    const conteudo = `

        <div style="
            max-width:280px;
            font-family:Arial,sans-serif;
        ">

            <h3 style="
                margin:0 0 8px 0;
            ">
                ${escaparHTML(nome)}
            </h3>


            <p style="
                margin:5px 0;
            ">
                <strong>
                    ${categoria}
                </strong>
            </p>


            <p style="
                margin:8px 0;
                font-size:14px;
            ">
                ${escaparHTML(endereco)}
            </p>


            <a
                href="${urlGoogleMaps}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                    display:inline-block;
                    margin-top:5px;
                "
            >
                Ver no Google Maps
            </a>

        </div>

    `;


    janelaInfo.setContent(
        conteudo
    );


    janelaInfo.open({

        map: mapa,

        anchor: marcador
    });
}


// ============================================================
// MOSTRAR RESULTADOS DA PESQUISA
// ============================================================

function mostrarResultados(resultados) {

    const lista =
        document.getElementById(
            "result-list"
        );


    if (!lista) return;


    lista.innerHTML = "";


    resultados.forEach(function (local) {

        const item =
            document.createElement("div");


        item.className =
            "map-result";


        item.style.cursor =
            "pointer";

        item.style.padding =
            "12px";

        item.style.marginBottom =
            "8px";

        item.style.border =
            "1px solid #ddd";

        item.style.borderRadius =
            "8px";


        const nome =
            local.displayName ||
            "Local";


        const endereco =
            local.formattedAddress ||
            "Endereço não informado";


        item.innerHTML = `

            <strong>
                ${escaparHTML(nome)}
            </strong>

            <br>

            <small>
                ${escaparHTML(endereco)}
            </small>

        `;


        item.addEventListener(
            "click",
            function () {

                if (local.location) {

                    mapa.setCenter(
                        local.location
                    );

                    mapa.setZoom(16);
                }
            }
        );


        lista.appendChild(item);
    });
}


// ============================================================
// MOSTRAR RESULTADOS DOS SERVIÇOS
// ============================================================

function mostrarResultadosServicos(
    delegacias,
    hospitais,
    cras
) {

    const lista =
        document.getElementById(
            "result-list"
        );


    if (!lista) return;


    lista.innerHTML = "";


    adicionarTituloLista(
        lista,
        "🚔 Delegacias"
    );


    adicionarItensLista(
        lista,
        delegacias,
        "police"
    );


    adicionarTituloLista(
        lista,
        "🏥 Hospitais"
    );


    adicionarItensLista(
        lista,
        hospitais,
        "hospital"
    );


    adicionarTituloLista(
        lista,
        "🏠 CRAS"
    );


    adicionarItensLista(
        lista,
        cras,
        "cras"
    );
}


// ============================================================
// TÍTULO DA LISTA
// ============================================================

function adicionarTituloLista(
    lista,
    titulo
) {

    const elemento =
        document.createElement("h3");


    elemento.textContent =
        titulo;


    elemento.style.marginTop =
        "18px";


    lista.appendChild(
        elemento
    );
}


// ============================================================
// ITENS DA LISTA
// ============================================================

function adicionarItensLista(
    lista,
    resultados,
    tipo
) {

    resultados.forEach(function (local) {

        const item =
            document.createElement("div");


        item.className =
            "map-result";


        item.style.cursor =
            "pointer";

        item.style.padding =
            "12px";

        item.style.marginBottom =
            "8px";

        item.style.border =
            "1px solid #ddd";

        item.style.borderRadius =
            "8px";


        const nome =
            local.displayName ||
            "Local";


        const endereco =
            local.formattedAddress ||
            "Endereço não informado";


        item.innerHTML = `

            <strong>
                ${escaparHTML(nome)}
            </strong>

            <br>

            <small>
                ${escaparHTML(endereco)}
            </small>

        `;


        item.addEventListener(
            "click",
            function () {

                if (local.location) {

                    mapa.setCenter(
                        local.location
                    );

                    mapa.setZoom(16);


                    // Procura o marcador correspondente
                    const marcador =
                        marcadores.find(
                            function (m) {

                                if (!m.position)
                                    return false;

                                const pos =
                                    m.position;

                                return (
                                    Math.abs(
                                        pos.lat -
                                        local.location.lat()
                                    ) < 0.00001
                                    &&
                                    Math.abs(
                                        pos.lng -
                                        local.location.lng()
                                    ) < 0.00001
                                );
                            }
                        );


                    if (marcador) {

                        abrirInfoLocal(
                            local,
                            tipo,
                            marcador
                        );
                    }
                }
            }
        );


        lista.appendChild(item);
    });
}


// ============================================================
// MOSTRAR LISTA DE UMA CATEGORIA
// ============================================================

function mostrarListaCategoria(
    resultados,
    nomeCategoria
) {

    const lista =
        document.getElementById(
            "result-list"
        );


    if (!lista) return;


    lista.innerHTML = "";


    adicionarTituloLista(
        lista,
        nomeCategoria
    );


    resultados.forEach(function (local) {

        const item =
            document.createElement("div");


        item.style.cursor =
            "pointer";

        item.style.padding =
            "12px";

        item.style.marginBottom =
            "8px";

        item.style.border =
            "1px solid #ddd";

        item.style.borderRadius =
            "8px";


        item.innerHTML = `

            <strong>
                ${escaparHTML(
                    local.displayName ||
                    "Local"
                )}
            </strong>

            <br>

            <small>
                ${escaparHTML(
                    local.formattedAddress ||
                    "Endereço não informado"
                )}
            </small>

        `;


        item.addEventListener(
            "click",
            function () {

                if (!local.location)
                    return;


                mapa.setCenter(
                    local.location
                );

                mapa.setZoom(16);
            }
        );


        lista.appendChild(item);
    });
}


// ============================================================
// LIMPAR MARCADORES
// ============================================================

function limparMarcadores() {

    marcadores.forEach(
        function (marcador) {

            marcador.map = null;
        }
    );


    marcadores = [];
}


// ============================================================
// STATUS DO MAPA
// ============================================================

function atualizarStatus(
    mensagem
) {

    const status =
        document.getElementById(
            "map-status"
        );


    if (status) {

        status.textContent =
            mensagem;
    }
}


// ============================================================
// PROTEÇÃO CONTRA HTML
// ============================================================

function escaparHTML(texto) {

    if (texto === null ||
        texto === undefined) {

        return "";
    }


    return String(texto)

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


// ============================================================
// ERRO DE AUTENTICAÇÃO DO GOOGLE MAPS
// ============================================================

window.gm_authFailure =
    function () {

        atualizarStatus(
            "A chave da API do Google Maps foi recusada. Verifique a chave, as APIs ativadas e as restrições."
        );

        console.error(
            "Google Maps: erro de autenticação da API."
        );
    };


// ============================================================
// DEIXA A FUNÇÃO DISPONÍVEL PARA O GOOGLE
// ============================================================

window.initMap =
    initMap;


window.buscarEndereco =
    buscarEndereco;


window.usarMinhaLocalizacao =
    usarMinhaLocalizacao;


window.buscarTipo =
    buscarTipo;


// ============================================================
// FIM
// ============================================================

