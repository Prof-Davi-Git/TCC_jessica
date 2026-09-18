/* =========================================================
   NAVEGAÇÃO ENTRE PÁGINAS
========================================================= */

function go(page) {

  const pages = document.querySelectorAll('.page');

  pages.forEach(p => {
      p.classList.add('hidden');
  });

  const targetPage = document.getElementById('page-' + page);

  if (targetPage) {
      targetPage.classList.remove('hidden');
  }

  document
      .querySelectorAll('.nav-links button[data-page]')
      .forEach(button => {
          button.classList.toggle(
              'active',
              button.dataset.page === page
          );
      });

  const moreMenu = document.getElementById('moreMenu');

  if (moreMenu) {
      moreMenu.classList.add('hidden');
  }

  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}


/* =========================================================
 BOTÕES DA NAVEGAÇÃO
========================================================= */

document
  .querySelectorAll('.nav-links button[data-page]')
  .forEach(button => {

      button.addEventListener('click', () => {
          go(button.dataset.page);
      });

  });


/* =========================================================
 MENU "MAIS"
========================================================= */

function toggleMore(event) {

  if (event) {
      event.stopPropagation();
  }

  const menu = document.getElementById('moreMenu');

  if (!menu) return;

  menu.classList.toggle('hidden');
}


document.addEventListener('click', () => {

  const menu = document.getElementById('moreMenu');

  if (menu) {
      menu.classList.add('hidden');
  }

});


/* =========================================================
 SAÍDA RÁPIDA
========================================================= */

function quickExit() {

  window.location.replace(
      'https://www.google.com/search?q=previsão+do+tempo'
  );

}


/*
  ESC = saída rápida.

  Não ativa enquanto a pessoa estiver digitando
  em input, textarea ou outros campos.
*/

document.addEventListener('keydown', event => {

  const activeElement = document.activeElement;

  const isTyping =
      activeElement &&
      (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable
      );

  if (event.key === 'Escape' && !isTyping) {
      quickExit();
  }

});


/* =========================================================
 MODAIS
========================================================= */



function openLogin() {

  const modal =
      document.getElementById('loginModal');

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


/* Fechar modal clicando fora */

document.addEventListener('click', event => {

  if (!event.target.classList.contains('modal-overlay')) {
      return;
  }

  event.target.classList.add('hidden');

});


/* =========================================================
 TEMA CLARO / ESCURO
========================================================= */

function toggleTheme() {

  const html =
      document.documentElement;

  const themeButton =
      document.getElementById('themeBtn');

  if (!html) return;

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


/* Recuperar tema salvo */

document.addEventListener('DOMContentLoaded', () => {

  const savedTheme =
      localStorage.getItem('theme');

  const html =
      document.documentElement;

  const themeButton =
      document.getElementById('themeBtn');

  if (!savedTheme) return;

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

});


/* =========================================================
 NOTÍCIAS
========================================================= */

const news = [

  {
      tag: "NACIONAL · 10/08/2026",

      title:
          "Homem é preso suspeito de arremessar copo de vidro contra a companheira durante discussão em Porangaba",

      text:
          "Apesar da tentativa, o copo não atingiu a mulher, que relatou já ter sofrido violência doméstica pelo marido anteriormente.",

      image:
          "img/img1.jpg"
  },


  {
      tag: "NACIONAL · 31/07/2026 ",

      title:
          "Homem acusado de crimes contra 20 mulheres é preso após irmã expor os casos",

      text:
          "Homem de 47 anos é investigado por violência doméstica e sexual no RS; página criada pela irmã fez surgir dezenas de novos relatos.",

      image:
          "img/img2.jpg"
  },


  {
      tag: "NACIONAL · 05/08/2026",

      title:
          "Mulher denuncia violência doméstica durante atendimento médico e homem é preso em Marília",

      text:
          "Vítima com ferimentos graves no rosto conseguiu pedir ajuda a funcionários longe do suspeito, na noite de sábado (12). Agressor foi detido na sala de espera de hospital. Ele responderá por violência doméstica, lesão corporal e ameaça.",

      image:
          "img/img3.avif"
  },


  {
      tag: "NACIONAL . 23.04.2024",

      title:
          "Médico é condenado a 10 anos de prisão por violação sexual de três mulheres durante exames ginecológicos",

      text:
          "O juiz Marcio Soares da Cunha, 3ª Vara Criminal de Palmas, condenou a 10 anos e seis meses de prisão, em regime fechado, o médico de 65 anos acusado do crime de violação sexual mediante fraude, contra três vítimas mulheres, durante exames ginecológicos realizados entre 2016 e 2022.",

      image:
          "img/img4.jpg"
  },


  {
      tag: "NACIONAL · 12/04/2019 ",

      title:
          "Homem é condenado a 100 anos de prisão por abuso sexual de filhas e enteada em Itapoá",

      text:
          "Um homem de 47 anos foi condenado, esta semana, a 100 anos, quatro meses e 15 dias de reclusão por abusar, ao longo de diversos anos, de duas filhas biológicas e uma enteada no município de Itapoá, norte de Santa Catarina. A sentença foi proferida pela juíza Aline Vasty Ferrandin,  titular da 2ª Vara da comarca de Itapoá.",

      image:
          "img/img5.jpg"
  },


  {
      tag: "NACIONAL · 08/08/2026",

      title:
          "Homem é preso após quebrar móveis e agredir companheira na frente dos filhos no interior de SP",

      text:
          "Segundo a Polícia Militar, os cinco filhos da vítima presenciaram as agressões na casa da família em Registro (SP). Ela possuía medida protetiva contra ele.",

      image:
          "img/img6.png"
  }

];


/* =========================================================
 RENDERIZAR NOTÍCIAS
========================================================= */

function renderNews() {

  const newsGrid =
      document.getElementById('newsGrid');

  if (!newsGrid) return;


  newsGrid.innerHTML = news.map((item, index) => `

      <div class="card news-card">


          <!-- IMAGEM DA NOTÍCIA -->

          <div class="news-thumb">

              <img
                  src="${item.image}"
                  alt="${item.title}"
                  style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                      display:block;
                  "
                  onerror="this.style.display='none';"
              >

          </div>


          <!-- CONTEÚDO -->

          <div class="news-body">


              <div class="news-meta">
                  ${item.tag}
              </div>


              <h4>
                  ${item.title}
              </h4>


              <p>
                  ${item.text}
              </p>


              <div class="news-actions">


                  <button
                      class="chip-btn"
                      type="button"
                      onclick="toggleComments(${index})"
                  >
                      💬 Comentários
                  </button>


                  <button
                      class="chip-btn"
                      type="button"
                      onclick="shareNews(${index})"
                  >
                      ↗ Compartilhar
                  </button>


              </div>


              <!-- COMENTÁRIOS -->

              <div
                  class="comments hidden"
                  id="comments-${index}"
              >


                  <div class="comment">


                      <div class="avatar">
                          MC
                      </div>


                      <div>

                          <div class="comment-name">
                              Maria C.
                          </div>

                          <div class="comment-body">
                              Bom ficarmos atentas!
                          </div>

                      </div>


                  </div>


                  <div class="comment">


                      <div class="avatar">
                          JR
                      </div>


                      <div>

                          <div class="comment-name">
                              Julia R.
                          </div>

                          <div class="comment-body">
                              Obrigada por divulgar.
                          </div>

                      </div>


                  </div>


                  <!-- FORMULÁRIO DE COMENTÁRIO -->

                  <div class="comment-form">


                      <input
                          type="text"
                          placeholder="Escrever um comentário..."
                          aria-label="Escrever um comentário"
                      >


                      <button
                          type="button"
                          onclick="sendComment(${index})"
                      >
                          Enviar
                      </button>


                  </div>


              </div>


          </div>


      </div>

  `).join('');

}


/* =========================================================
 MOSTRAR / ESCONDER COMENTÁRIOS
========================================================= */

function toggleComments(index) {

  const comments =
      document.getElementById(
          'comments-' + index
      );

  if (!comments) return;

  comments.classList.toggle('hidden');

}


/* =========================================================
 COMPARTILHAR NOTÍCIA
========================================================= */

function shareNews(index) {

  const item =
      news[index];

  if (!item) return;


  const text =
      `${item.title}\n\n${item.text}`;


  if (navigator.share) {

      navigator.share({

          title: item.title,

          text: text,

          url: window.location.href

      }).catch(() => {});


  } else {

      navigator.clipboard
          .writeText(text)

          .then(() => {

              alert(
                  'Texto da notícia copiado!'
              );

          })

          .catch(() => {

              alert(
                  'Não foi possível copiar a notícia.'
              );

          });

  }

}


/* =========================================================
 COMENTÁRIOS
========================================================= */

function sendComment(index) {

  const container =
      document.getElementById(
          'comments-' + index
      );

  if (!container) return;


  const input =
      container.querySelector(
          '.comment-form input'
      );

  if (!input) return;


  const value =
      input.value.trim();


  if (!value) {

      alert(
          'Digite um comentário antes de enviar.'
      );

      return;

  }


  alert(
      'Protótipo — comentário enviado apenas visualmente.'
  );


  input.value = '';

}


/* =========================================================
 FAQ
========================================================= */

const faqs = [

  {
      q:
          "Como faço para denunciar sem colocar minha identidade em risco?",

      a:
          "É possível denunciar de forma sigilosa pelo 180 ou 100. Seus dados pessoais só são revelados se você autorizar."
  },


  {
      q:
          "A medida protetiva de urgência é paga?",

      a:
          "Não. O pedido pode ser feito gratuitamente na Delegacia da Mulher ou com apoio da Defensoria Pública."
  },


  {
      q:
          "Posso denunciar violência psicológica, mesmo sem provas físicas?",

      a:
          "Sim. A Lei Maria da Penha reconhece violência psicológica, moral e patrimonial, além da física e sexual."
  },


  {
      q:
          "O que acontece depois que eu denuncio?",

      a:
          "A denúncia pode gerar um boletim de ocorrência e dar início aos procedimentos policiais e aos pedidos de medida protetiva."
  },


  {
      q:
          "Posso usar este site pelo celular sem que apareça no histórico?",

      a:
          "O recurso de Saída rápida troca a página instantaneamente, mas não apaga o histórico do navegador. Para isso, é necessário usar as configurações do próprio navegador."
  }

];


/* =========================================================
 RENDERIZAR FAQ
========================================================= */

function renderFAQ() {

  const faqList =
      document.getElementById('faqList');

  if (!faqList) return;


  faqList.innerHTML = faqs.map(
      (item, index) => `

      <div
          class="faq-item"
          id="faq-${index}"
      >

          <div
              class="faq-q"
              onclick="toggleFaq(${index})"
          >

              <span>
                  ${item.q}
              </span>

              <span class="chev">
                  ⌄
              </span>

          </div>


          <div class="faq-a">

              <div class="faq-a-inner">
                  ${item.a}
              </div>

          </div>

      </div>

  `).join('');

}


/* =========================================================
 ABRIR / FECHAR FAQ
========================================================= */

function toggleFaq(index) {

  const faq =
      document.getElementById(
          'faq-' + index
      );

  if (!faq) return;

  faq.classList.toggle('open');

}


/* =========================================================
 HISTÓRIAS
========================================================= */

const stories = [

  {
      q:
          "“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hoje eu sei que pedir ajuda foi o começo de tudo.”",

      who:
          "— Relato fictício, 34 anos"
  },


  {
      q:
          "“Sed do eiusmod tempor incididunt ut labore. Encontrei apoio onde menos esperava.”",

      who:
          "— Relato fictício, 28 anos"
  },


  {
      q:
          "“Ut enim ad minim veniam, quis nostrud exercitation. Hoje ajudo outras mulheres a encontrar esse caminho.”",

      who:
          "— Relato fictício, 41 anos"
  }

];


/* =========================================================
 RENDERIZAR HISTÓRIAS
========================================================= */

function renderStories() {

  const storiesGrid =
      document.getElementById(
          'storiesGrid'
      );

  if (!storiesGrid) return;


  storiesGrid.innerHTML =
      stories.map(story => `

      <div class="card story-card">

          <div class="story-quote">
              ${story.q}
          </div>

          <div class="story-who">
              ${story.who}
          </div>

      </div>

  `).join('');

}


/* =========================================================
 CAMPANHAS
========================================================= */

const campaigns = [

  {
      title:
          "Agosto Lilás",

      text:
          "Mês nacional de mobilização em referência à Lei Maria da Penha."
  },


  {
      title:
          "16 Dias de Ativismo",

      text:
          "Campanha internacional contra a violência de gênero, de 25/11 a 10/12."
  },


  {
      title:
          "Sinal Vermelho",

      text:
          "Gesto simbólico para pedir ajuda discretamente em farmácias parceiras."
  }

];


/* =========================================================
 RENDERIZAR CAMPANHAS
========================================================= */

function renderCampaigns() {

  const campaignGrid =
      document.getElementById(
          'campaignGrid'
      );

  if (!campaignGrid) return;


  campaignGrid.innerHTML =
      campaigns.map(campaign => `

      <div class="card campaign-card">

          <div class="campaign-band"></div>


          <div class="campaign-body">

              <h4>
                  ${campaign.title}
              </h4>


              <p
                  style="
                      font-size:13.5px;
                      color:var(--text-soft);
                      margin-top:8px;
                  "
              >
                  ${campaign.text}
              </p>

          </div>

      </div>

  `).join('');

}


/* =========================================================
 CHAT
========================================================= */

function escapeHTML(text) {

  const div =
      document.createElement('div');

  div.textContent =
      text;

  return div.innerHTML;

}


/* =========================================================
 ENVIAR CHAT
========================================================= */

function sendChat() {

  const input =
      document.getElementById(
          'chatInput'
      );

  const body =
      document.getElementById(
          'chatBody'
      );

  if (!input || !body) return;


  const value =
      input.value.trim();


  if (!value) return;


  /* Mensagem do usuário */

  body.insertAdjacentHTML(
      'beforeend',

      `
      <div class="bubble user">
          ${escapeHTML(value)}
      </div>
      `
  );


  input.value = '';


  body.scrollTop =
      body.scrollHeight;


  /* Resposta automática */

  setTimeout(() => {

      body.insertAdjacentHTML(
          'beforeend',

          `
          <div class="bubble bot">

              Entendi. Em uma versão completa,
              eu te direcionaria ao serviço mais
              adequado com base no que você digitou.

              Por enquanto, veja a seção
              "Onde buscar ajuda".

          </div>
          `
      );


      body.scrollTop =
          body.scrollHeight;

  }, 500);

}


/* =========================================================
 ENTER ENVIA MENSAGEM
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

      const chatInput =
          document.getElementById(
              'chatInput'
          );


      if (chatInput) {

          chatInput.addEventListener(
              'keydown',
              event => {

                  if (
                      event.key === 'Enter' &&
                      !event.shiftKey
                  ) {

                      event.preventDefault();

                      sendChat();

                  }

              }
          );

      }

  }
);


/* =========================================================
 INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

      renderNews();

      renderFAQ();

      renderStories();

      renderCampaigns();

  }
);


