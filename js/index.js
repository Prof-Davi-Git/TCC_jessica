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
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

      renderFAQ();

      renderStories();

      renderCampaigns();

  }
);
