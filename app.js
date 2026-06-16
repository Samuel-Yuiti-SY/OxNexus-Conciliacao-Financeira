const landing = document.querySelector("#landing");
const prototype = document.querySelector("#prototype");
const loginView = document.querySelector("#loginView");
const appShell = document.querySelector("#appShell");
const sideMenu = document.querySelector("#sideMenu");
const appContent = document.querySelector("#appContent");
const screenTitle = document.querySelector("#screenTitle");
const screenEyebrow = document.querySelector("#screenEyebrow");
const toast = document.querySelector("#toast");
const drawer = document.querySelector("#detailDrawer");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerText = document.querySelector("#drawerText");

const state = {
  screen: "dashboard",
  toastTimer: null,
  imports: [
    ["vendas_maio_2026.csv", "CSV", "14/06/2026", "4.812", "Processado"],
    ["retorno_cnab_341.ret", "CNAB", "14/06/2026", "1.208", "Com divergências"],
    ["extrato_conta_237.ofx", "OFX", "13/06/2026", "928", "Aguardando análise"],
    ["boletos_gateway.xlsx", "Excel", "12/06/2026", "312", "Erro de layout"],
  ],
  tickets: [
    ["CH-1042", "Erro de importação", "Em análise", "Não conseguimos interpretar esse arquivo. O time técnico já recebeu o layout."],
    ["CH-1039", "Divergência financeira", "Respondido", "Há uma diferença de R$ 45,20 ligada à taxa cobrada pela operadora."],
    ["CH-1031", "Solicitação de novo CNPJ", "Aberto", "Novo CNPJ aguardando validação cadastral."],
  ],
  aiMessages: [
    ["ai", "Olá. Pergunte sobre a tela atual e eu ajudo a entender divergências, boletos, taxas ou conciliações."],
  ],
};

const screens = [
  { id: "dashboard", label: "Dashboard", icon: "DB", title: "Dashboard principal", eyebrow: "Visão consolidada" },
  { id: "imports", label: "Importações", icon: "IM", title: "Importações", eyebrow: "Entrada de dados" },
  { id: "sales", label: "Vendas", icon: "VD", title: "Vendas", eyebrow: "Registros vendidos" },
  { id: "payments", label: "Pagamentos", icon: "PG", title: "Pagamentos", eyebrow: "Recebimentos bancários" },
  { id: "boletos", label: "Boletos", icon: "BL", title: "Boletos", eyebrow: "Risco e conciliação" },
  { id: "rates", label: "Taxas", icon: "TX", title: "Taxas", eyebrow: "Operadoras e bandeiras" },
  { id: "nfce", label: "NFC-e", icon: "NF", title: "NFC-e", eyebrow: "Documentos fiscais" },
  { id: "ecommerce", label: "E-commerce", icon: "EC", title: "E-commerce", eyebrow: "Pedidos e gateways" },
  { id: "reconciliations", label: "Conciliações", icon: "CC", title: "Conciliações", eyebrow: "Divergências e ações" },
  { id: "antifraud", label: "Antifraude", icon: "AF", title: "Antifraude", eyebrow: "Regras de segurança" },
  { id: "ai", label: "IA OxNexus", icon: "IA", title: "IA OxNexus", eyebrow: "Ajuda contextual" },
  { id: "support", label: "Suporte", icon: "SP", title: "Suporte", eyebrow: "Atendimento" },
  { id: "settings", label: "Configurações", icon: "CF", title: "Configurações", eyebrow: "Parâmetros da empresa" },
  { id: "technical", label: "Técnica", icon: "LG", title: "Tela técnica", eyebrow: "Logs e regras aplicadas" },
];

const kpis = [
  ["Total vendido", "R$ 124.850,00", "Alta de 8,4% no período"],
  ["Total recebido", "R$ 117.420,00", "R$ 7.430,00 em análise"],
  ["Divergências", "R$ 7.430,00", "Identificamos pontos que precisam de atenção."],
  ["Boletos suspeitos", "12", "Marcados por regra de segurança."],
  ["Conciliações concluídas", "78%", "Base atualizada há 12 minutos."],
  ["Pendências em análise", "34", "Fila priorizada por impacto financeiro."],
];

const tables = {
  sales: {
    headers: ["Data", "Cliente", "Valor bruto", "Forma de pagamento", "Operadora", "Status da conciliação", "Ação"],
    rows: [
      ["16/06/2026", "Mercado Lira", "R$ 2.840,00", "Crédito", "Cielo", "Conciliado"],
      ["16/06/2026", "Studio Ápice", "R$ 1.260,00", "Pix", "Banco Itaú", "Conciliado"],
      ["15/06/2026", "Casa Nobre", "R$ 4.920,00", "Crédito", "Rede", "Divergente"],
      ["15/06/2026", "Nexus Moda", "R$ 890,00", "Débito", "Stone", "Aguardando análise"],
      ["14/06/2026", "Delta Foods", "R$ 3.430,00", "Boleto", "Banco Santander", "Suspeito"],
    ],
  },
  payments: {
    headers: ["Data prevista", "Data recebida", "Valor bruto", "Valor líquido", "Banco", "Conta", "Status", "Ação"],
    rows: [
      ["17/06/2026", "16/06/2026", "R$ 2.840,00", "R$ 2.781,00", "Itaú", "341-2201", "Conciliado"],
      ["16/06/2026", "16/06/2026", "R$ 1.260,00", "R$ 1.260,00", "Banco do Brasil", "001-3109", "Conciliado"],
      ["15/06/2026", "16/06/2026", "R$ 4.920,00", "R$ 4.874,80", "Bradesco", "237-8872", "Divergente"],
      ["14/06/2026", "-", "R$ 890,00", "-", "Santander", "033-9112", "Pendente"],
    ],
  },
  boletos: {
    headers: ["Nosso número", "Pagador", "Beneficiário", "Valor", "Vencimento", "Status bancário", "Classificação de risco", "Ação"],
    rows: [
      ["109238-7", "Mercado Lira", "OxNexus Tecnologia Ltda", "R$ 2.840,00", "18/06/2026", "Pago", "Conciliado"],
      ["109241-2", "Delta Foods", "OX Nexus Serviços ME", "R$ 3.430,00", "20/06/2026", "Pago", "Possível fraude"],
      ["109244-0", "Nexus Moda", "OxNexus Tecnologia Ltda", "R$ 890,00", "21/06/2026", "Em aberto", "Suspeito"],
      ["109245-3", "Casa Nobre", "OxNexus Tecnologia Ltda", "R$ 4.920,00", "22/06/2026", "Pago", "Divergente"],
    ],
  },
  rates: {
    headers: ["Operadora", "Bandeira", "Tipo de pagamento", "Taxa contratada", "Taxa cobrada", "Diferença", "Status", "Ação"],
    rows: [
      ["Cielo", "Visa", "Crédito à vista", "2,10%", "2,10%", "0,00%", "Conciliado"],
      ["Rede", "Mastercard", "Crédito 3x", "2,95%", "3,18%", "0,23%", "Divergente"],
      ["Stone", "Elo", "Débito", "1,35%", "1,35%", "0,00%", "Conciliado"],
      ["Getnet", "Visa", "Crédito 6x", "3,40%", "3,70%", "0,30%", "Divergente"],
    ],
  },
  nfce: {
    headers: ["Número", "Série", "Chave", "Valor fiscal", "Venda vinculada", "Status", "Ação"],
    rows: [
      ["89422", "003", "3526 0612 9841 0001 55", "R$ 2.840,00", "VD-21098", "Conciliado"],
      ["89423", "003", "3526 0612 9841 0002 36", "R$ 1.260,00", "VD-21104", "Conciliado"],
      ["89424", "003", "3526 0612 9841 0003 17", "R$ 4.920,00", "VD-21107", "Divergente"],
      ["89425", "003", "3526 0612 9841 0004 90", "R$ 890,00", "Sem vínculo", "Aguardando análise"],
    ],
  },
  ecommerce: {
    headers: ["Pedido", "Cliente", "Valor", "Gateway", "Marketplace", "Status pedido", "Status pagamento", "Status conciliação", "Ação"],
    rows: [
      ["#49822", "Ana Ribeiro", "R$ 589,90", "Pagar.me", "Loja própria", "Entregue", "Pago", "Conciliado"],
      ["#49831", "Rafael Costa", "R$ 1.249,00", "Mercado Pago", "Mercado Livre", "Enviado", "Pago", "Divergente"],
      ["#49842", "Marina Lopes", "R$ 320,00", "Stripe", "Loja própria", "Cancelado", "Reembolsado", "Conciliado"],
      ["#49857", "João Almeida", "R$ 2.100,00", "Adyen", "Amazon", "Entregue", "Chargeback", "Suspeito"],
    ],
  },
  reconciliations: {
    headers: ["Tipo", "Referência", "Valor esperado", "Valor encontrado", "Diferença", "Status", "Ação recomendada", "Ação"],
    rows: [
      ["Venda", "VD-21107", "R$ 4.920,00", "R$ 4.874,80", "R$ 45,20", "Divergente", "Revisar taxa cobrada"],
      ["Boleto", "109241-2", "R$ 3.430,00", "R$ 3.430,00", "R$ 0,00", "Possível fraude", "Validar beneficiário"],
      ["Pagamento", "PG-88210", "R$ 890,00", "-", "R$ 890,00", "Pendente", "Aguardar liquidação"],
      ["E-commerce", "#49831", "R$ 1.249,00", "R$ 1.217,10", "R$ 31,90", "Divergente", "Conferir gateway"],
    ],
  },
};

function statusClass(status) {
  const value = status.toLowerCase();
  if (value.includes("fraude") || value.includes("erro") || value.includes("chargeback")) return "danger";
  if (value.includes("suspeito")) return "suspect";
  if (value.includes("diverg") || value.includes("pendente")) return "warn";
  if (value.includes("aguardando") || value.includes("análise") || value.includes("aberto") || value.includes("respondido")) return "info";
  return "ok";
}

function pill(status) {
  return `<span class="pill ${statusClass(status)}">${status}</span>`;
}

function detailButton(label = "Ver detalhes", title = "Registro em análise") {
  return `<button class="row-action" type="button" data-action="open-drawer" data-title="${title}">${label}</button>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function setHash(hash) {
  const next = hash.startsWith("#") ? hash : `#${hash}`;
  if (window.location.hash !== next) {
    history.pushState(null, "", next);
  }
}

function showLanding(hash = "inicio") {
  landing.classList.remove("hidden");
  prototype.classList.add("hidden");
  drawer.classList.add("hidden");
  setHash(hash);
  setTimeout(() => {
    const target = document.querySelector(`#${hash}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
}

function showLogin() {
  landing.classList.add("hidden");
  prototype.classList.remove("hidden");
  loginView.classList.remove("hidden");
  appShell.classList.add("hidden");
  drawer.classList.add("hidden");
  setHash("login");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showApp(screen = "dashboard") {
  state.screen = screen;
  landing.classList.add("hidden");
  prototype.classList.remove("hidden");
  loginView.classList.add("hidden");
  appShell.classList.remove("hidden");
  drawer.classList.add("hidden");
  setHash(screen);
  renderMenu();
  renderScreen(screen);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMenu() {
  sideMenu.innerHTML = screens
    .map(
      (item) => `
        <button type="button" class="${item.id === state.screen ? "active" : ""}" data-action="nav-screen" data-screen="${item.id}">
          <span class="menu-icon">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `
    )
    .join("");
}

function renderScreen(screen) {
  const meta = screens.find((item) => item.id === screen) || screens[0];
  screenTitle.textContent = meta.title;
  screenEyebrow.textContent = meta.eyebrow;

  const renderers = {
    dashboard: renderDashboard,
    imports: renderImports,
    sales: () => renderTableScreen("Vendas registradas", "Compare vendas registradas com pagamentos recebidos e veja onde a conciliação precisa de atenção.", tables.sales),
    payments: () => renderTableScreen("Pagamentos recebidos", "Valide valores previstos, valores efetivamente pagos, banco, conta e status financeiro.", tables.payments),
    boletos: renderBoletos,
    rates: () => renderTableScreen("Taxas por operadora", "Identifique cobranças diferentes das taxas contratadas sem precisar abrir planilhas paralelas.", tables.rates),
    nfce: () => renderTableScreen("NFC-e vinculadas", "Cruze documentos fiscais com vendas registradas e encontre notas sem vínculo claro.", tables.nfce),
    ecommerce: () => renderTableScreen("Pedidos de e-commerce", "Valide pedidos, gateways, marketplaces, cancelamentos, reembolsos e chargebacks.", tables.ecommerce),
    reconciliations: renderReconciliations,
    antifraud: renderAntifraud,
    ai: renderAi,
    support: renderSupport,
    settings: renderSettings,
    technical: renderTechnical,
  };

  appContent.innerHTML = (renderers[screen] || renderers.dashboard)();
}

function screenIntro(title, text, action = "") {
  return `
    <div class="screen-intro">
      <p><strong>${title}.</strong> ${text}</p>
      ${action ? `<div class="toolbar">${action}</div>` : ""}
    </div>
  `;
}

function renderDashboard() {
  return `
    ${screenIntro("Clareza operacional", "Dados financeiros só geram valor quando a empresa consegue confiar neles. Aqui o time vê o que está certo, o que está divergente e o que precisa de atenção.")}
    <div class="kpi-grid">
      ${kpis
        .map(
          ([label, value, note]) => `
          <article class="stat-card">
            <span>${label}</span>
            <strong>${value}</strong>
            <small>${note}</small>
          </article>
        `
        )
        .join("")}
    </div>
    <div class="dashboard-grid">
      <article class="chart-card">
        <h3>Vendas x Recebimentos</h3>
        <div class="bar-chart">
          ${[
            ["Jan", 88, "R$ 82,4 mil"],
            ["Fev", 72, "R$ 77,1 mil"],
            ["Mar", 94, "R$ 95,8 mil"],
            ["Abr", 79, "R$ 84,6 mil"],
            ["Mai", 91, "R$ 101,2 mil"],
            ["Jun", 86, "R$ 117,4 mil"],
          ]
            .map(
              ([month, width, value]) => `
              <div class="bar-row">
                <span>${month}</span>
                <span class="bar-track"><i style="width:${width}%"></i></span>
                <strong>${value}</strong>
              </div>
            `
            )
            .join("")}
        </div>
      </article>
      <article class="chart-card">
        <h3>Status das conciliações</h3>
        <div class="donut-wrap">
          <div class="donut" aria-label="78% conciliado"></div>
          <div class="legend">
            <span><em><i style="background:#c0dcca"></i>Conciliado</em><strong>78%</strong></span>
            <span><em><i style="background:#ffb547"></i>Divergente</em><strong>12%</strong></span>
            <span><em><i style="background:#ff5d5d"></i>Risco alto</em><strong>10%</strong></span>
          </div>
        </div>
      </article>
    </div>
    <div class="dashboard-grid">
      <article class="chart-card">
        <h3>Distribuição por fonte</h3>
        <div class="source-grid">
          <span><strong>42%</strong> Operadoras</span>
          <span><strong>27%</strong> Bancos</span>
          <span><strong>18%</strong> ERP</span>
          <span><strong>8%</strong> E-commerce</span>
          <span><strong>3%</strong> NFC-e</span>
          <span><strong>2%</strong> Planilhas</span>
        </div>
      </article>
      <article class="chart-card">
        <h3>Próximas ações</h3>
        <div class="ticket-list">
          <div class="ticket-item"><strong>Revisar boletos suspeitos</strong><span>12 registros marcados por regra de segurança.</span></div>
          <div class="ticket-item"><strong>Validar taxas divergentes</strong><span>R$ 221,40 de diferença estimada neste ciclo.</span></div>
          <div class="ticket-item"><strong>Confirmar pagamentos pendentes</strong><span>34 pendências aguardando liquidação ou análise.</span></div>
        </div>
      </article>
    </div>
    <article class="table-card">
      <h3>Conciliações recentes</h3>
      ${renderTable(tables.reconciliations.headers, tables.reconciliations.rows)}
    </article>
  `;
}

function renderImports() {
  return `
    ${screenIntro("Importações", "Envie arquivos CSV, Excel, CNAB ou OFX para que a OxNexus organize os dados antes da conciliação.")}
    <div class="upload-panel">
      <div>
        <strong>Importar arquivo financeiro</strong>
        <p>Tipos aceitos: CSV, Excel, CNAB, OFX.</p>
      </div>
      <button class="primary-button" type="button" data-action="import-file">Importar arquivo</button>
    </div>
    <article class="table-card">
      <h3>Arquivos importados</h3>
      ${renderTable(["Nome do arquivo", "Tipo", "Data", "Registros", "Status"], state.imports)}
    </article>
  `;
}

function renderTableScreen(title, text, tableData) {
  return `
    ${screenIntro(title, text)}
    <article class="table-card">
      <h3>${title}</h3>
      ${renderTable(tableData.headers, tableData.rows)}
    </article>
  `;
}

function renderBoletos() {
  return `
    ${screenIntro("Boletos em análise", "Esse boleto foi marcado como suspeito por regra de segurança. Revise beneficiário, valor, vencimento e vínculo interno antes de confirmar a conciliação.")}
    <div class="mini-card-grid">
      <article class="mini-card"><span>Conciliados</span><strong>186</strong></article>
      <article class="mini-card"><span>Divergentes</span><strong>24</strong></article>
      <article class="mini-card"><span>Suspeitos</span><strong>12</strong></article>
      <article class="mini-card"><span>Possível fraude</span><strong>3</strong></article>
      <article class="mini-card"><span>Em aberto</span><strong>41</strong></article>
    </div>
    <article class="table-card">
      <h3>Boletos</h3>
      ${renderTable(tables.boletos.headers, tables.boletos.rows)}
    </article>
  `;
}

function renderReconciliations() {
  return `
    ${screenIntro("Conciliações", "Revise os dados antes de confirmar a conciliação. A IA pode ajudar a entender cada divergência.")}
    <div class="filter-bar">
      <label>Tipo<select><option>Todos</option><option>Venda</option><option>Boleto</option><option>Pagamento</option></select></label>
      <label>Status<select><option>Todos</option><option>Divergente</option><option>Conciliado</option><option>Possível fraude</option></select></label>
      <label>Período<input type="text" value="Últimos 30 dias" /></label>
      <label>Valor<input type="text" value="Acima de R$ 100,00" /></label>
      <label>Empresa<select><option>Todos os CNPJs</option><option>Matriz</option><option>Filial SP</option></select></label>
    </div>
    <article class="table-card">
      <h3>Registros conciliados e divergentes</h3>
      ${renderTable(tables.reconciliations.headers, tables.reconciliations.rows)}
    </article>
  `;
}

function renderAntifraud() {
  const alerts = [
    ["Alerta 001", "Beneficiário divergente", "Possível fraude"],
    ["Alerta 002", "Valor diferente", "Divergente"],
    ["Alerta 003", "Duplicidade encontrada", "Suspeito"],
  ];
  return `
    ${screenIntro("Antifraude", "A OxNexus prioriza alertas que podem impactar o caixa. Cada regra mostra por que o boleto ou registro merece atenção.")}
    <div class="mini-card-grid">
      <article class="mini-card"><span>Beneficiário divergente</span><strong>3</strong></article>
      <article class="mini-card"><span>Valor divergente</span><strong>7</strong></article>
      <article class="mini-card"><span>Linha digitável suspeita</span><strong>2</strong></article>
      <article class="mini-card"><span>Duplicidade</span><strong>5</strong></article>
      <article class="mini-card"><span>Pago sem registro interno</span><strong>4</strong></article>
    </div>
    <article class="table-card">
      <h3>Lista de alertas</h3>
      ${renderTable(["Alerta", "Regra aplicada", "Classificação", "Ação"], alerts)}
    </article>
  `;
}

function renderAi() {
  return `
    ${screenIntro("IA OxNexus", "Pergunte sobre a tela atual. A resposta considera o contexto financeiro da operação demonstrativa.")}
    <div class="ai-layout">
      <article class="ai-panel">
        <h3>Conversa</h3>
        <div class="chat-window" id="chatWindow">
          ${state.aiMessages.map(([who, text]) => `<div class="message ${who}">${text}</div>`).join("")}
        </div>
        <div class="chat-input">
          <input id="aiInput" type="text" placeholder="Pergunte à IA OxNexus" />
          <button class="primary-button" type="button" data-action="send-ai">Perguntar à IA</button>
        </div>
      </article>
      <aside class="ai-panel">
        <h3>Perguntas rápidas</h3>
        <div class="quick-questions">
          <button type="button" data-question="Por que esse boleto está suspeito?">Por que esse boleto está suspeito?</button>
          <button type="button" data-question="O que significa status divergente?">O que significa status divergente?</button>
          <button type="button" data-question="Como corrigir uma taxa divergente?">Como corrigir uma taxa divergente?</button>
          <button type="button" data-question="Como funciona a conciliação de vendas?">Como funciona a conciliação de vendas?</button>
        </div>
      </aside>
    </div>
  `;
}

function renderSupport() {
  return `
    ${screenIntro("Suporte", "Abra solicitações com contexto financeiro, categoria e status para acompanhar o atendimento sem perder histórico.")}
    <div class="support-layout">
      <form class="form-panel" id="ticketForm">
        <h3>Abrir solicitação</h3>
        <label>Categoria<select name="category"><option>Dúvida</option><option>Erro de importação</option><option>Divergência financeira</option><option>Solicitação de novo CNPJ</option><option>Solicitação de nova operadora</option></select></label>
        <label>Resumo<input name="summary" value="Preciso revisar uma divergência financeira" /></label>
        <button class="primary-button full" type="submit">Abrir chamado</button>
      </form>
      <article class="support-card">
        <h3>Lista de chamados</h3>
        <div class="ticket-list">
          ${state.tickets
            .map(
              ([code, category, status, text]) => `
              <div class="ticket-item">
                <strong>${code} - ${category}</strong>
                <span>${pill(status)} ${text}</span>
              </div>
            `
            )
            .join("")}
        </div>
      </article>
    </div>
  `;
}

function renderTechnical() {
  return `
    ${screenIntro("Tela técnica", "Área reservada para perfis técnicos acompanharem logs, regras aplicadas e reprocessamentos.", '<button class="primary-button compact-button" type="button" data-action="reprocess">Reprocessar</button>')}
    <div class="technical-grid">
      <article class="technical-card">
        <h3>Logs de importação</h3>
        <div class="log-list">
          <div class="log-item"><strong>retorno_cnab_341.ret</strong><span>Regra CNAB aplicada. 18 divergências encontradas.</span></div>
          <div class="log-item"><strong>boletos_gateway.xlsx</strong><span>Não conseguimos interpretar esse arquivo. Verifique se o layout está correto ou envie para análise técnica.</span></div>
          <div class="log-item"><strong>extrato_conta_237.ofx</strong><span>Arquivo processado com 928 registros e 6 pendências de vínculo.</span></div>
        </div>
      </article>
      <article class="technical-card">
        <h3>Regras aplicadas</h3>
        <div class="log-list">
          <div class="log-item"><strong>Beneficiário autorizado</strong><span>Compara beneficiário do boleto com cadastro da empresa.</span></div>
          <div class="log-item"><strong>Tolerância de taxa</strong><span>Diferenças acima de R$ 0,10 entram na fila de revisão.</span></div>
          <div class="log-item"><strong>Duplicidade bancária</strong><span>Localiza registros com mesmo valor, vencimento e pagador.</span></div>
        </div>
      </article>
    </div>
    <article class="table-card" style="margin-top:14px">
      <h3>Registros divergentes</h3>
      ${renderTable(tables.reconciliations.headers, tables.reconciliations.rows)}
    </article>
  `;
}

function renderSettings() {
  return `
    ${screenIntro("Configurações", "Defina dados da empresa, usuários, permissões, contas bancárias e parâmetros de conciliação.")}
    <div class="settings-grid">
      <article class="setting-card">
        <h3>Dados e permissões</h3>
        <div class="settings-list">
          <div class="settings-item"><strong>Empresa</strong><span>OxNexus Demonstração Ltda - CNPJ 12.345.678/0001-90</span></div>
          <div class="settings-item"><strong>Usuários</strong><span>8 usuários ativos, 2 administradores.</span></div>
          <div class="settings-item"><strong>Permissões</strong><span>Financeiro, auditoria, técnico e leitura executiva.</span></div>
          <div class="settings-item"><strong>Contas bancárias</strong><span>Itaú, Bradesco, Banco do Brasil e Santander.</span></div>
        </div>
      </article>
      <form class="setting-card settings-form">
        <h3>Parâmetros de conciliação</h3>
        <label>Tolerância de diferença<input value="R$ 0,10" /></label>
        <label>Notificações<select><option>Ativas para divergências e risco alto</option><option>Apenas risco alto</option><option>Desativadas</option></select></label>
        <label>Conciliação automática<select><option>Ativar quando não houver divergência</option><option>Exigir aprovação manual</option></select></label>
        <button class="primary-button full" type="button" data-action="save-settings">Salvar configurações</button>
      </form>
    </div>
  `;
}

function renderTable(headers, rows) {
  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => {
              const actionNeeded = headers.some((header) => header === "Ação");
              const baseCells = row.map((cell, index) => {
                const isStatusColumn = /status|classificação/i.test(headers[index] || "");
                return `<td>${isStatusColumn ? pill(cell) : cell}</td>`;
              });
              if (actionNeeded && row.length < headers.length) {
                baseCells.push(`<td>${detailButton()}</td>`);
              }
              return `<tr>${baseCells.join("")}</tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function askAi(question) {
  if (!question.trim()) {
    showToast("Digite uma pergunta para a IA OxNexus.");
    return;
  }
  state.aiMessages.push(["user", question.trim()]);
  state.aiMessages.push(["ai", aiAnswer(question)]);
  renderScreen("ai");
  setTimeout(() => {
    const chatWindow = document.querySelector("#chatWindow");
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 0);
}

function aiAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes("boleto")) {
    return "Esse boleto foi classificado como suspeito porque o beneficiário informado é diferente do beneficiário cadastrado para sua empresa. Revise o beneficiário antes de confirmar o pagamento.";
  }
  if (q.includes("divergente") || q.includes("divergência")) {
    return "Status divergente significa que o valor esperado não bate com o valor encontrado. A diferença pode vir de taxa, atraso de liquidação, reembolso, chargeback ou registro duplicado.";
  }
  if (q.includes("taxa")) {
    return "Para corrigir uma taxa divergente, compare a taxa contratada com a taxa cobrada, valide a bandeira e registre a tratativa com a operadora.";
  }
  if (q.includes("venda")) {
    return "A conciliação de vendas cruza o registro vendido com o pagamento recebido, a taxa cobrada, o documento fiscal e a fonte bancária.";
  }
  return "Posso ajudar a entender o motivo da divergência, sugerir a próxima ação e indicar quais dados precisam ser revisados.";
}

function openDrawer(title = "Registro em análise") {
  drawerTitle.textContent = title;
  drawerText.textContent = "Identificamos divergências que precisam de atenção. Revise os dados antes de confirmar a conciliação.";
  drawer.classList.remove("hidden");
}

function routeFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (hash === "login") return showLogin();
  if (screens.some((item) => item.id === hash)) return showApp(hash);
  if (hash && document.querySelector(`#${hash}`)) {
    landing.classList.remove("hidden");
    prototype.classList.add("hidden");
    return;
  }
  showLanding("inicio");
}

document.addEventListener("click", (event) => {
  const questionButton = event.target.closest("[data-question]");
  if (questionButton) {
    askAi(questionButton.dataset.question);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  if (action === "open-login") showLogin();
  if (action === "open-demo") {
    showApp("dashboard");
    showToast("Demonstração carregada com dados fictícios realistas.");
  }
  if (action === "back-home") showLanding("inicio");
  if (action === "forgot") showToast("Enviamos um fluxo simulado de recuperação para o e-mail de demonstração.");
  if (action === "logout") showLogin();
  if (action === "nav-screen") showApp(actionTarget.dataset.screen);
  if (action === "toggle-menu") document.querySelector(".sidebar").classList.toggle("open");
  if (action === "ask-ai") showApp("ai");
  if (action === "technical") showApp("technical");
  if (action === "contact") showToast("Solicitação registrada. Um especialista entraria em contato nesta etapa.");
  if (action === "import-file") {
    state.imports.unshift(["novo_arquivo_demo.csv", "CSV", "16/06/2026", "248", "Aguardando análise"]);
    renderScreen("imports");
    showToast("Arquivo demonstrativo adicionado à fila de análise.");
  }
  if (action === "open-drawer") openDrawer(actionTarget.dataset.title);
  if (action === "close-drawer") drawer.classList.add("hidden");
  if (action === "confirm-review") {
    drawer.classList.add("hidden");
    showToast("Registro marcado como revisado no protótipo.");
  }
  if (action === "send-ai") {
    const input = document.querySelector("#aiInput");
    askAi(input ? input.value : "");
  }
  if (action === "reprocess") showToast("Reprocessamento iniciado. Os registros divergentes seriam atualizados ao final.");
  if (action === "save-settings") showToast("Configurações salvas no protótipo.");
});

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = form.get("email");
  const password = form.get("password");
  if (email === "admin@oxnexus.com" && password === "123456") {
    showApp("dashboard");
    showToast("Bem-vindo ao protótipo OxNexus.");
  } else {
    showToast("Use o usuário de demonstração informado na tela de login.");
  }
});

prototype.addEventListener("submit", (event) => {
  if (event.target.id !== "ticketForm") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const category = form.get("category");
  const summary = form.get("summary");
  state.tickets.unshift([`CH-${1043 + state.tickets.length}`, category, "Aberto", summary]);
  renderScreen("support");
  showToast("Chamado aberto com contexto financeiro da tela.");
});

window.addEventListener("popstate", routeFromHash);
routeFromHash();
