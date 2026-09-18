/* =========================================================================
   ASSISTENTE VOZATIVA — respostas pré-programadas (sem IA, sem API externa)
   -------------------------------------------------------------------------
   Este arquivo não altera o HTML/CSS existentes. Ele apenas:
   - injeta os botões de resposta rápida abaixo da mensagem inicial;
   - implementa sendChat() (chamada pelo botão "Enviar" no HTML);
   - reconhece palavras-chave digitadas e responde de forma acolhedora.

   Para adicionar uma nova resposta, basta criar uma nova entrada dentro
   de RESPOSTAS (mesmo padrão das outras) e, se quiser, um botão em
   QUICK_REPLIES.
   ========================================================================= */

   (function () {
    "use strict";
  
    /* ------------------------- 1. BASE DE RESPOSTAS ------------------------ */
    // Cada entrada tem: palavras-chave (para detecção) e o texto de resposta.
    // A ordem em ORDEM_PRIORIDADE define qual assunto "ganha" quando a
    // mensagem da usuária contém termos de mais de uma categoria.
    const RESPOSTAS = {
      emergencia: {
        keywords: [
          "estou em perigo", "perigo", "ele esta aqui", "ela esta aqui",
          "socorro", "preciso de ajuda agora", "me ajuda agora",
          "estao me ameacando", "estou sendo ameacada", "ameacando",
          "corro risco", "correndo risco", "ele vai me machucar"
        ],
        texto: `
          <strong>Se você está correndo perigo agora, sua segurança vem primeiro.</strong><br><br>
          Se for possível, vá até um local seguro e acione o serviço de emergência mais adequado:<br><br>
          📞 <strong>190</strong> — Polícia Militar<br>
          📞 <strong>192</strong> — SAMU<br>
          📞 <strong>180</strong> — Central de Atendimento à Mulher<br><br>
          Você não fez nada para merecer isso. Se quiser, posso te mostrar o mapa com serviços próximos ou a página de denúncias.
        `
      },
  
      central180: {
        keywords: ["180", "central de atendimento", "o que e o 180", "ligar 180"],
        texto: `
          O <strong>180</strong> é a Central de Atendimento à Mulher, um canal telefônico gratuito
          que funciona 24 horas para orientação e acolhimento em situações de violência.<br><br>
          Você pode ligar para tirar dúvidas, pedir orientação sobre seus direitos ou relatar uma
          situação — não precisa ser uma emergência para procurar esse serviço.
        `
      },
  
      delegacia: {
        keywords: [
          "delegacia", "deam", "delegacia da mulher", "registrar ocorrencia",
          "boletim de ocorrencia", "fazer um bo", "bo"
        ],
        texto: `
          A <strong>Delegacia da Mulher (DEAM)</strong> é uma unidade policial especializada em
          atender mulheres em situação de violência. Lá você pode registrar uma ocorrência e
          receber orientação sobre os próximos passos.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('mapa')">🗺️ Encontrar uma unidade no mapa</button>
        `
      },
  
      saude: {
        keywords: [
          "hospital", "atendimento medico", "atendimento de saude", "ferimento",
          "estou machucada", "machucado", "precisar de saude", "preciso de atendimento",
          "pronto socorro", "posto de saude"
        ],
        texto: `
          Se você está ferida ou precisa de cuidados de saúde, procure atendimento médico o quanto antes —
          isso vale mesmo que o ferimento pareça pequeno. Buscar atendimento de saúde também pode ser
          importante depois de uma situação de violência, mesmo sem ferimentos visíveis.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('mapa')">🗺️ Encontrar um hospital no mapa</button>
        `
      },
  
      cras: {
        keywords: ["cras", "assistencia social", "servico de assistencia"],
        texto: `
          O <strong>CRAS</strong> (Centro de Referência de Assistência Social) é um serviço público
          onde você pode buscar orientação e ter acesso a programas de assistência social.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('mapa')">🗺️ Encontrar um CRAS no mapa</button>
        `
      },
  
      denuncia: {
        keywords: ["como denuncio", "como denunciar", "denunciar", "denuncia", "fazer uma denuncia"],
        texto: `
          Existem alguns caminhos possíveis para buscar ajuda e denunciar uma situação de violência,
          como a Delegacia da Mulher, o 180 ou os canais indicados na nossa página de Denúncias.<br><br>
          Se você está em perigo agora, priorize sua segurança e procure ajuda imediata antes de
          qualquer outra coisa.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('denuncias')">📄 Ir para a página de Denúncias</button>
        `
      },
  
      protetiva: {
        keywords: [
          "medida protetiva", "medida de protecao", "protecao legal", "medida protetiva de urgencia"
        ],
        texto: `
          As <strong>medidas protetivas</strong> são mecanismos legais que existem para ajudar a proteger
          mulheres em situação de violência, como o afastamento do agressor.<br><br>
          Não posso dar orientação jurídica sobre o seu caso específico — para isso, procure a
          Delegacia da Mulher ou um serviço especializado, que vai avaliar a sua situação com cuidado.
        `
      },
  
      tiposViolencia: {
        keywords: [
          "tipos de violencia", "violencia fisica", "violencia psicologica",
          "violencia sexual", "violencia patrimonial", "violencia moral"
        ],
        texto: `
          Existem diferentes formas de violência contra a mulher:<br><br>
          <strong>Física</strong> — qualquer ação que ofenda a integridade ou saúde corporal.<br>
          <strong>Psicológica</strong> — humilhação, ameaça, controle ou manipulação emocional.<br>
          <strong>Sexual</strong> — qualquer ato sexual sem consentimento.<br>
          <strong>Patrimonial</strong> — controle ou destruição de bens, documentos ou dinheiro.<br>
          <strong>Moral</strong> — calúnia, difamação ou injúria.<br><br>
          Se algo que você viveu se parece com uma dessas descrições, você pode buscar ajuda —
          não precisa enfrentar isso sozinha.
        `
      },
  
      apoioEmocional: {
        keywords: [
          "estou com medo", "tenho medo", "estou triste", "nao sei o que fazer",
          "estou desesperada", "me sinto culpada", "estou sozinha", "estou perdida"
        ],
        texto: `
          Sinto muito que você esteja passando por isso. O que você sente é válido, e você não
          precisa enfrentar essa situação sozinha.<br><br>
          Se estiver em perigo agora, procure um local seguro e peça ajuda imediatamente. Se quiser,
          também posso te mostrar opções de apoio emocional e psicológico.
        `
      },
  
      planoSeguranca: {
        keywords: [
          "como me proteger", "o que faco para sair de casa", "sair de casa",
          "plano de seguranca", "como me defender", "como sair dessa situacao"
        ],
        texto: `
          Algumas orientações gerais que podem ajudar, dependendo da sua situação:<br><br>
          • Identifique um local seguro para onde possa ir, se precisar.<br>
          • Avise uma pessoa de confiança sobre o que está acontecendo.<br>
          • Mantenha documentos e itens importantes de fácil acesso.<br>
          • Procure serviços especializados para orientação personalizada.<br>
          • Evite confrontar diretamente o agressor quando isso puder aumentar o risco.<br><br>
          Cada situação é diferente — um serviço especializado pode te ajudar a montar um plano
          mais adequado ao seu caso.
        `
      },
  
      privacidade: {
        keywords: [
          "essa conversa e privada", "isso fica salvo", "privacidade", "alguem ve essa conversa",
          "isso e seguro", "meus dados ficam salvos"
        ],
        texto: `
          Quero ser honesta com você: este é um protótipo de site e não posso garantir sigilo total
          da forma como um atendimento humano especializado garantiria.<br><br>
          Se você estiver em um computador ou celular compartilhado, use a "Saída rápida" no topo da
          página sempre que precisar sair rapidamente.
        `
      },
  
      materiais: {
        keywords: [
          "material educativo", "materiais educativos", "meus direitos", "prevencao",
          "quero aprender sobre violencia"
        ],
        texto: `
          Temos uma seção com conteúdos sobre violência contra a mulher, direitos e prevenção.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('materiais')">📚 Ver Materiais Educativos</button>
        `
      },
  
      localizacao: {
        keywords: [
          "onde tem uma delegacia", "hospital perto de mim", "onde encontro um cras",
          "tem uma deam perto", "servico perto de mim", "onde fica"
        ],
        texto: `
          Posso te ajudar a encontrar um serviço próximo de você.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('mapa')">🗺️ Abrir o Mapa</button>
        `
      },
  
      noticias: {
        keywords: ["noticias", "acontecimentos recentes", "novidades"],
        texto: `
          Você pode acompanhar notícias e acontecimentos relacionados ao tema na nossa página de Notícias.<br><br>
          <button type="button" class="chat-action-btn" onclick="navigateTo('noticias')">📰 Ver Notícias</button>
        `
      },
  
      padrao: {
        keywords: [],
        texto: `
          Posso te ajudar com informações sobre emergência, denúncias, Delegacia da Mulher,
          hospitais, CRAS, tipos de violência, medidas protetivas, segurança e serviços de apoio.
          O que você gostaria de saber?
        `
      }
    };
  
    // Ordem em que as categorias são checadas (emergência sempre primeiro).
    const ORDEM_PRIORIDADE = [
      "emergencia", "central180", "delegacia", "saude", "cras", "denuncia",
      "protetiva", "tiposViolencia", "apoioEmocional", "planoSeguranca",
      "privacidade", "materiais", "localizacao", "noticias"
    ];
  
    /* --------------------- 2. BOTÕES DE RESPOSTA RÁPIDA --------------------- */
    const QUICK_REPLIES = [
      { label: "🚨 Estou em perigo", mensagem: "Estou em perigo" },
      { label: "📞 Como denunciar?", mensagem: "Como denunciar?" },
      { label: "👮 Delegacia da Mulher", mensagem: "Delegacia da Mulher" },
      { label: "🏥 Preciso de atendimento", mensagem: "Preciso de atendimento médico" },
      { label: "🏠 Onde encontrar ajuda?", mensagem: "Onde encontro um CRAS?" },
      { label: "🛡️ Medida protetiva", mensagem: "O que é uma medida protetiva?" },
      { label: "💜 Tipos de violência", mensagem: "Quais são os tipos de violência?" },
      { label: "🗺️ Encontrar um serviço", mensagem: "Onde tem uma delegacia perto de mim?" }
    ];
  
    // Resposta especial e mais completa, distinta das demais.
    const RESPOSTA_AJUDA_AGORA = `
      <strong>Você está em perigo neste momento?</strong><br><br>
      Se sim, procure um local seguro e peça ajuda imediatamente.<br><br>
      📞 <strong>190</strong> — Polícia Militar<br>
      📞 <strong>192</strong> — SAMU<br>
      📞 <strong>180</strong> — Central de Atendimento à Mulher<br><br>
      <button type="button" class="chat-action-btn" onclick="navigateTo('mapa')">🗺️ Abrir mapa</button>
      <button type="button" class="chat-action-btn" onclick="navigateTo('denuncias')">📄 Ir para denúncias</button>
    `;
  
    /* ------------------------------ 3. UTIL --------------------------------- */
  
    // Remove acentuação e caixa alta para facilitar a comparação de palavras-chave.
    function normalizar(texto) {
      return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }
  
    // Evita que HTML digitado pela usuária seja interpretado como marcação.
    function escaparHtml(texto) {
      const div = document.createElement("div");
      div.textContent = texto;
      return div.innerHTML;
    }
  
    function encontrarResposta(mensagem) {
      const textoNormalizado = normalizar(mensagem);
  
      for (const chave of ORDEM_PRIORIDADE) {
        const categoria = RESPOSTAS[chave];
        const encontrou = categoria.keywords.some((palavra) =>
          textoNormalizado.includes(normalizar(palavra))
        );
        if (encontrou) return categoria.texto;
      }
  
      return RESPOSTAS.padrao.texto;
    }
  
    /* --------------------------- 4. RENDER NO CHAT --------------------------- */
  
    function getChatBody() {
      return document.getElementById("chatBody");
    }
  
    function adicionarBolha(htmlConteudo, autor) {
      const chatBody = getChatBody();
      if (!chatBody) return;
  
      const bolha = document.createElement("div");
      bolha.className = "bubble " + (autor === "usuaria" ? "user" : "bot");
      bolha.innerHTML = htmlConteudo;
  
      chatBody.appendChild(bolha);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  
    function mostrarDigitando(callback) {
      // Pequeno atraso para simular resposta, sem parecer instantâneo demais.
      setTimeout(callback, 350);
    }
  
    function processarMensagem(mensagemOriginal) {
      if (!mensagemOriginal || !mensagemOriginal.trim()) return;
  
      adicionarBolha(escaparHtml(mensagemOriginal), "usuaria");
  
      mostrarDigitando(function () {
        const resposta = encontrarResposta(mensagemOriginal);
        adicionarBolha(resposta, "bot");
      });
    }
  
    /* ------------------------- 5. BOTÕES NO CHAT ----------------------------- */
  
    function criarBotoesRapidos() {
      const chatBody = getChatBody();
      if (!chatBody) return;
  
      const container = document.createElement("div");
      container.className = "quick-replies";
      container.id = "quickReplies";
  
      QUICK_REPLIES.forEach(function (item) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "quick-reply-btn";
        botao.textContent = item.label;
        botao.onclick = function () {
          processarMensagem(item.mensagem);
        };
        container.appendChild(botao);
      });
  
      // Botão especial "Preciso de ajuda agora", com resposta diferenciada.
      const botaoAjudaAgora = document.createElement("button");
      botaoAjudaAgora.type = "button";
      botaoAjudaAgora.className = "quick-reply-btn quick-reply-emergencia";
      botaoAjudaAgora.textContent = "🆘 Preciso de ajuda agora";
      botaoAjudaAgora.onclick = function () {
        adicionarBolha(escaparHtml("Preciso de ajuda agora"), "usuaria");
        mostrarDigitando(function () {
          adicionarBolha(RESPOSTA_AJUDA_AGORA, "bot");
        });
      };
      container.appendChild(botaoAjudaAgora);
  
      chatBody.appendChild(container);
    }
  
    /* --------------------------- 6. ENTRADA DO CHAT --------------------------- */
  
    // Chamada pelo botão "Enviar" já existente no HTML: onclick="sendChat()"
    window.sendChat = function () {
      const input = document.getElementById("chatInput");
      if (!input) return;
  
      const mensagem = input.value;
      input.value = "";
      processarMensagem(mensagem);
    };
  
    function configurarEnter() {
      const input = document.getElementById("chatInput");
      if (!input) return;
  
      input.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
          evento.preventDefault();
          window.sendChat();
        }
      });
    }
  
    /* ------------------------------ 7. INIT ----------------------------------- */
  
    document.addEventListener("DOMContentLoaded", function () {
      criarBotoesRapidos();
      configurarEnter();
    });
  })();