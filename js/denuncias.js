/* =========================================================
   ENVIO DE DENÚNCIA
========================================================= */

// COLOQUE AQUI A URL DO SEU GOOGLE APPS SCRIPT
const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycby7G08_00cchGjSctsGjEVI3FUa1R0q0j9AYACCoSHJzw2NOnWcSQm-ek-Qsh3ISaognQ/exec";


async function enviarDenuncia() {

    // Pega os valores preenchidos no formulário

    const tipo =
        document.getElementById("tipoOcorrencia").value;

    const cidade =
        document.getElementById("cidade").value.trim();

    const relato =
        document.getElementById("relato").value.trim();

    const anonimo =
        document.getElementById("anonimo").checked;


    // Verifica se a cidade foi preenchida

    if (!cidade) {

        alert("Por favor, informe a cidade ou CEP.");

        return;

    }


    // Encontra o botão

    const botao =
        document.querySelector(".form-box .btn-primary");


    // Muda o botão enquanto envia

    botao.disabled = true;

    botao.textContent = "Enviando...";


    try {

        const resposta = await fetch(URL_APPS_SCRIPT, {

            method: "POST",

            body: JSON.stringify({

                tipo: tipo,

                cidade: cidade,

                relato: relato,

                anonimo: anonimo

            })

        });


        const resultado =
            await resposta.json();


        // Se o Apps Script respondeu que deu certo

        if (resultado.sucesso) {

            alert(
                "Relato enviado com sucesso!"
            );


            // Limpa os campos

            document.getElementById("cidade").value = "";

            document.getElementById("relato").value = "";

            document.getElementById("anonimo").checked = false;


        } else {

            alert(
                "Não foi possível enviar o relato."
            );

        }


    } catch (erro) {

        console.error(erro);

        alert(
            "Ocorreu um erro ao enviar o relato."
        );

    }


    // Volta o botão ao normal

    botao.disabled = false;

    botao.textContent = "Enviar relato";

}