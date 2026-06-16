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
const actionModal = document.querySelector("#actionModal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalFooter = document.querySelector("#modalFooter");

const state = {
  screen: "dashboard",
  toastTimer: null,
  fraudConfirmed: false,
  sidebarCollapsed: localStorage.getItem("oxnexus.sidebarCollapsed") === "true",
  focusMode: false,
  filtersVisible: localStorage.getItem("oxnexus.filtersVisible") !== "false",
  filtersBeforeFocus: true,
  advancedSummaryVisible: localStorage.getItem("oxnexus.advancedSummaryVisible") === "true",
  imports: [
    ["vendas_pdv_01062026.csv", "Vendas ERP/PDV", "PDV", "01/06/2026", "420", "418", "2", "Processado", "Lucas Henrique"],
    ["cielo_recebiveis_junho.csv", "Agenda de recebíveis", "Cielo", "01/06/2026", "385", "380", "5", "Com divergências", "Samuel Yuiti"],
    ["extrato_itau_0106.ofx", "Extrato bancário", "Itaú", "01/06/2026", "96", "96", "0", "Processado", "Lucas Henrique"],
    ["boletos_emitidos.csv", "Boletos", "ERP", "01/06/2026", "214", "210", "4", "Aguardando análise", "Tiago Schult"],
  ],
  tickets: [
    ["CH-1042", "Erro de importação", "Alta", "Em análise", "Tiago Schult", "16/06/2026 09:20"],
    ["CH-1039", "Divergência financeira", "Média", "Respondido", "Mateus Sobral", "15/06/2026 17:40"],
    ["CH-1031", "Novo CNPJ", "Baixa", "Aberto", "Gabriel de Melo", "14/06/2026 11:05"],
  ],
  aiMessages: [
    ["ai", "Olá. Pergunte sobre a tela atual e eu ajudo a entender divergências, boletos, taxas, depósitos e conciliações."],
  ],
};

const screens = [
  { id: "dashboard", label: "Dashboard", icon: "DB", title: "Dashboard executivo", eyebrow: "01/06/2026 a 15/06/2026" },
  { id: "imports", label: "Importações", icon: "IM", title: "Importações", eyebrow: "Entrada e validação de dados" },
  { id: "sales", label: "Vendas ERP/PDV", icon: "VD", title: "Vendas ERP/PDV", eyebrow: "Sistema interno do cliente" },
  { id: "operator", label: "Transações Operadora", icon: "OP", title: "Transações operadora", eyebrow: "Adquirentes, gateways e apps" },
  { id: "receivables", label: "Recebíveis", icon: "RC", title: "Recebíveis", eyebrow: "Agenda prevista de liquidação" },
  { id: "deposits", label: "Depósitos Bancários", icon: "DP", title: "Depósitos bancários", eyebrow: "Extrato, CNAB e OFX" },
  { id: "boletos", label: "Boletos", icon: "BL", title: "Boletos", eyebrow: "Pagos, vencidos e suspeitos" },
  { id: "rates", label: "Taxas", icon: "TX", title: "Taxas", eyebrow: "Contratada x cobrada" },
  { id: "nfce", label: "NFC-e", icon: "NF", title: "NFC-e", eyebrow: "Documento fiscal x venda" },
  { id: "ecommerce", label: "E-commerce", icon: "EC", title: "E-commerce", eyebrow: "Pedidos, gateways e chargebacks" },
  { id: "reconciliations", label: "Conciliações", icon: "CC", title: "Conciliações", eyebrow: "Tela central da plataforma" },
  { id: "antifraud", label: "Antifraude", icon: "AF", title: "Antifraude", eyebrow: "Riscos, alertas e regras" },
  { id: "reports", label: "Relatórios", icon: "RT", title: "Relatórios", eyebrow: "Valor entregue e histórico" },
  { id: "ai", label: "IA OxNexus", icon: "IA", title: "IA OxNexus", eyebrow: "Ajuda contextual" },
  { id: "support", label: "Suporte", icon: "SP", title: "Suporte", eyebrow: "Chamados e solicitações" },
  { id: "technical", label: "Área Técnica", icon: "LG", title: "Área técnica", eyebrow: "Logs, regras e mapeamentos" },
  { id: "settings", label: "Configurações", icon: "CF", title: "Configurações", eyebrow: "Empresa, usuários e parâmetros" },
];

const dashboardKpis = [
  ["Total vendido no ERP", "R$ 286.420,90", "Base: Ox Comércio Demonstrativo LTDA"],
  ["Total confirmado nas operadoras", "R$ 285.980,90", "Cielo, Rede, Stone, Getnet, Mercado Pago e Pagar.me"],
  ["Total líquido previsto", "R$ 277.015,60", "Após taxas e parcelas calculadas"],
  ["Total recebido no banco", "R$ 275.930,45", "Itaú, Sicredi, Banco do Brasil e Caixa"],
  ["Diferença encontrada", "R$ 1.085,15", "Esse valor não bate com o depósito localizado no banco."],
  ["Vendas conciliadas", "1.195", "Boa notícia: a maior parte das vendas do período já está conciliada."],
  ["Vendas divergentes", "31", "Encontramos divergências que precisam da sua atenção."],
  ["Vendas não encontradas", "16", "Há registros em uma origem sem par correspondente."],
  ["Boletos suspeitos", "6", "Marcados por regra de segurança."],
  ["Possíveis fraudes", "2", "Beneficiário ou conta divergente."],
  ["Taxas divergentes", "R$ 545,15", "Identificamos taxas cobradas acima do cadastro contratado."],
];

const referenceKpis = [
  { title: "Vendas", value: "R$ 125.000", variation: "+12,5%", tone: "ok", icon: "VD" },
  { title: "Pagamentos", value: "R$ 98.000", variation: "+10,2%", tone: "ok", icon: "PG" },
  { title: "Divergências", value: "128", variation: "-0,7%", tone: "warn", icon: "DV" },
  { title: "Suspeitos", value: "45", variation: "+5,2%", tone: "danger", icon: "AF" },
];

const revenueData = [
  { month: "Jan", value: 72000 },
  { month: "Fev", value: 81000 },
  { month: "Mar", value: 76000 },
  { month: "Abr", value: 92000 },
  { month: "Mai", value: 88000 },
  { month: "Jun", value: 105000 },
];

const sourceDistribution = [
  { label: "Vendas", value: 42, color: "#24B6AA" },
  { label: "Pagamentos", value: 28, color: "#C0DCCA" },
  { label: "Boletos", value: 15, color: "#18A7FF" },
  { label: "NFC-e", value: 9, color: "#FFB547" },
  { label: "E-commerce", value: 6, color: "#A178FF" },
];

const latestDivergences = [
  ["24/05/2026", "Boleto", "Valor não recebido", "R$ 2.250,00", "Divergente"],
  ["24/05/2026", "Cartão", "Taxa divergente", "R$ 128,40", "Divergente"],
  ["24/05/2026", "NFC-e", "Venda sem documento", "R$ 680,00", "Em análise"],
  ["23/05/2026", "E-commerce", "Pedido cancelado com pagamento", "R$ 940,00", "Suspeito"],
  ["23/05/2026", "Banco", "Depósito não identificado", "R$ 1.480,00", "Em análise"],
];

const commonFilters = ["Período", "Empresa/CNPJ", "Loja", "Operadora", "Banco", "Canal", "Status"];

const tables = {
  sales: {
    description: "Vendas registradas no sistema interno do cliente.",
    filters: ["Período", "Loja", "Forma de pagamento", "Operadora", "Bandeira", "Status", "NSU", "Valor"],
    actions: ["Importar vendas", "Conciliar selecionadas", "Exportar CSV", "Exportar PDF", "Ver detalhes", "Criar regra de correspondência", "Perguntar à IA"],
    headers: ["Data da venda", "Loja", "Cliente", "Documento", "Forma", "Operadora esperada", "Bandeira", "NSU", "Autorização", "Valor bruto", "Parcelas", "Status conciliação", "Ação"],
    rows: [
      ["03/06/2026", "Loja Maringá", "Cliente A", "NFC-e 12345", "Crédito", "Cielo", "Visa", "82741", "551920", "R$ 240,00", "3x", "Conciliado"],
      ["03/06/2026", "Loja Maringá", "Cliente B", "NFC-e 12346", "Débito", "Rede", "Mastercard", "82742", "882110", "R$ 89,90", "1x", "Divergente"],
      ["04/06/2026", "Loja Londrina", "Cliente C", "NFC-e 12347", "Crédito", "Stone", "Elo", "82743", "110554", "R$ 1.250,00", "6x", "Não encontrado"],
    ],
  },
  operator: {
    description: "Transações retornadas por adquirentes, gateways ou apps de pagamento.",
    filters: ["Período", "Operadora", "Estabelecimento", "Terminal", "Bandeira", "Modalidade", "Status", "NSU"],
    actions: ["Importar transações", "Comparar com ERP", "Ver divergentes", "Exportar", "Agrupar por lote", "Ver agenda de recebíveis"],
    headers: ["Data captura", "Operadora", "Estabelecimento", "Terminal", "NSU", "Autorização", "TID", "Bandeira", "Modalidade", "Valor bruto", "Parcelas", "Status operadora", "Ação"],
    rows: [
      ["03/06/2026", "Cielo", "Estab. 1029", "POS 04", "82741", "551920", "TID984550", "Visa", "Crédito", "R$ 240,00", "3x", "Confirmada"],
      ["03/06/2026", "Rede", "Estab. 1150", "POS 02", "82742", "882110", "TID775210", "Mastercard", "Débito", "R$ 92,90", "1x", "Confirmada"],
      ["04/06/2026", "Stone", "Estab. 8891", "POS 01", "82799", "990012", "TID221100", "Elo", "Crédito", "R$ 450,00", "2x", "Não encontrada no ERP"],
    ],
  },
  receivables: {
    description: "Agenda de valores que a empresa deve receber das operadoras.",
    filters: ["Data prevista", "Operadora", "Bandeira", "Lote", "Status", "Diferença"],
    actions: ["Importar agenda", "Simular taxas", "Ver liquidações", "Comparar com banco", "Exportar agenda", "Solicitar análise"],
    headers: ["Data prevista", "Operadora", "Bandeira", "Lote", "Quantidade vendas", "Valor bruto", "Taxa prevista", "Taxa cobrada", "Valor líquido previsto", "Status", "Ação"],
    rows: [
      ["07/06/2026", "Cielo", "Visa", "Lote 7781", "82", "R$ 18.420,00", "R$ 482,50", "R$ 482,50", "R$ 17.937,50", "Conciliado"],
      ["07/06/2026", "Rede", "Mastercard", "Lote 7782", "51", "R$ 9.980,00", "R$ 249,50", "R$ 289,50", "R$ 9.690,50", "Taxa divergente"],
      ["08/06/2026", "Stone", "Elo", "Lote 7783", "33", "R$ 12.250,00", "R$ 330,75", "R$ 330,75", "R$ 11.919,25", "Pendente"],
    ],
  },
  deposits: {
    description: "Valores efetivamente encontrados no extrato bancário.",
    filters: ["Data", "Banco", "Conta", "Origem provável", "Status", "Valor"],
    actions: ["Importar OFX", "Importar CNAB", "Vincular recebível", "Conciliar depósito", "Marcar como não identificado", "Exportar extrato conciliado", "Perguntar à IA"],
    headers: ["Data", "Banco", "Conta", "Histórico", "Documento", "Valor", "Lote vinculado", "Origem provável", "Status", "Ação"],
    rows: [
      ["07/06/2026", "Itaú", "12345-6", "CIELO PAGTO CARTAO", "DOC7781", "R$ 17.937,50", "Lote 7781", "Cielo", "Conciliado"],
      ["07/06/2026", "Itaú", "12345-6", "REDE CREDENCIADORA", "DOC7782", "R$ 9.650,50", "Lote 7782", "Rede", "Divergente"],
      ["08/06/2026", "Sicredi", "99887-1", "CREDITO DIVERSOS", "DOC0009", "R$ 1.480,00", "Não vinculado", "Não identificada", "Em análise"],
    ],
  },
  boletos: {
    description: "Controle de boletos emitidos, pagos, vencidos, baixados e suspeitos.",
    filters: ["Vencimento", "Pagador", "Beneficiário", "Status bancário", "Classificação", "Valor"],
    actions: ["Importar boletos", "Validar boletos", "Ver suspeitos", "Marcar como revisado", "Confirmar fraude", "Descartar suspeita", "Abrir chamado", "Exportar relatório antifraude"],
    headers: ["Nosso número", "Pagador", "Beneficiário esperado", "Beneficiário informado", "Valor emitido", "Valor pago", "Vencimento", "Status bancário", "Classificação", "Ação"],
    rows: [
      ["100245", "Cliente Alfa", "Loja Maringá LTDA", "Loja Maringá LTDA", "R$ 850,00", "R$ 850,00", "10/06/2026", "Pago", "Conciliado"],
      ["100246", "Cliente Beta", "Loja Maringá LTDA", "Beneficiário Desconhecido", "R$ 1.200,00", "R$ 1.200,00", "10/06/2026", "Pago", state.fraudConfirmed ? "Fraude confirmada" : "Possível fraude"],
      ["100247", "Cliente Gama", "Loja Maringá LTDA", "Loja Maringá LTDA", "R$ 980,00", "R$ 930,00", "11/06/2026", "Pago", "Divergente"],
      ["100248", "Cliente Delta", "Loja Maringá LTDA", "Loja Maringá LTDA", "R$ 430,00", "R$ 0,00", "05/06/2026", "Vencido", "Em análise"],
    ],
  },
  rates: {
    description: "Comparação entre taxa contratada e taxa cobrada.",
    filters: ["Operadora", "Bandeira", "Modalidade", "Parcelas", "Status", "Impacto"],
    actions: ["Cadastrar taxa", "Importar contrato", "Simular taxa", "Ver divergências", "Aplicar regra", "Exportar relatório"],
    headers: ["Operadora", "Bandeira", "Modalidade", "Parcelas", "Taxa contratada", "Taxa cobrada", "Diferença", "Valor impactado", "Status", "Ação"],
    rows: [
      ["Cielo", "Visa", "Crédito", "3x", "2,50%", "2,50%", "0,00%", "R$ 0,00", "Conciliado"],
      ["Rede", "Mastercard", "Débito", "1x", "1,40%", "1,70%", "+0,30%", "R$ 40,00", "Divergente"],
      ["Stone", "Elo", "Crédito", "6x", "2,70%", "2,90%", "+0,20%", "R$ 98,30", "Divergente"],
    ],
  },
  nfce: {
    description: "Validação entre documentos fiscais, vendas e pagamentos.",
    filters: ["Data", "Série", "Status SEFAZ", "Status conciliação", "Valor"],
    actions: ["Importar NFC-e", "Cruzar com vendas", "Ver canceladas com pagamento", "Ver sem venda vinculada", "Exportar inconsistências"],
    headers: ["Número", "Série", "Chave", "Data", "Valor fiscal", "Venda vinculada", "Status SEFAZ", "Status conciliação", "Ação"],
    rows: [
      ["12345", "1", "412606...", "03/06/2026", "R$ 240,00", "NSU 82741", "Autorizada", "Conciliada"],
      ["12346", "1", "412606...", "03/06/2026", "R$ 89,90", "NSU 82742", "Autorizada", "Divergente"],
      ["12347", "1", "412606...", "04/06/2026", "R$ 450,00", "Não vinculada", "Cancelada", "Atenção"],
    ],
  },
  ecommerce: {
    description: "Conciliação de pedidos, gateways, marketplaces, cancelamentos e reembolsos.",
    filters: ["Canal", "Gateway", "Status pedido", "Status pagamento", "Status conciliação", "Valor"],
    actions: ["Importar pedidos", "Importar gateway", "Ver chargebacks", "Ver reembolsos", "Conciliar pedidos", "Exportar relatório"],
    headers: ["Pedido", "Cliente", "Canal", "Gateway", "Valor pedido", "Frete", "Desconto", "Status pedido", "Status pagamento", "Status conciliação", "Ação"],
    rows: [
      ["PED-9001", "Cliente A", "Loja virtual", "Pagar.me", "R$ 320,00", "R$ 20,00", "R$ 0,00", "Enviado", "Pago", "Conciliado"],
      ["PED-9002", "Cliente B", "Marketplace", "Mercado Pago", "R$ 580,00", "R$ 0,00", "R$ 50,00", "Cancelado", "Pago", "Divergente"],
      ["PED-9003", "Cliente C", "Loja virtual", "Stripe", "R$ 1.100,00", "R$ 35,00", "R$ 0,00", "Entregue", "Chargeback", "Atenção"],
    ],
  },
  reconciliations: {
    description: "Tela central da plataforma. Revise os dados antes de confirmar a conciliação.",
    filters: ["Tipo", "Status", "Período", "Empresa", "Operadora", "Banco", "Valor", "Diferença", "Risco"],
    actions: ["Conciliar automaticamente", "Conciliar manualmente", "Desconciliar", "Ver detalhes", "Aprovar ajuste", "Ignorar com justificativa", "Criar regra", "Reprocessar selecionados", "Exportar", "Perguntar à IA"],
    headers: ["Tipo", "Referência", "Origem 1", "Origem 2", "Valor esperado", "Valor encontrado", "Diferença", "Status", "Confiança", "Ação recomendada", "Ação"],
    rows: [
      ["Venda", "NSU 82741", "ERP", "Cielo", "R$ 240,00", "R$ 240,00", "R$ 0,00", "Conciliado", "100%", "Nenhuma"],
      ["Pagamento", "Lote 7782", "Rede", "Banco", "R$ 9.690,50", "R$ 9.650,50", "R$ 40,00", "Divergente", "82%", "Revisar taxa"],
      ["Boleto", "100246", "ERP", "Banco", "R$ 1.200,00", "R$ 1.200,00", "R$ 0,00", state.fraudConfirmed ? "Fraude confirmada" : "Possível fraude", "65%", "Validar beneficiário"],
      ["NFC-e", "12347", "SEFAZ", "ERP", "R$ 450,00", "R$ 0,00", "R$ 450,00", "Não encontrado", "70%", "Revisar cancelamento"],
    ],
  },
};

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function statusClass(status) {
  const value = normalize(status);
  if (value.includes("fraude") || value.includes("nao encontrado") || value.includes("erro") || value.includes("chargeback")) return "danger";
  if (value.includes("suspeito") || value.includes("atencao") || value.includes("alto")) return "suspect";
  if (value.includes("diverg") || value.includes("vencido") || value.includes("atrasado") || value.includes("taxa")) return "warn";
  if (value.includes("analise") || value.includes("reprocessando") || value.includes("pendente") || value.includes("previsto")) return "reserve";
  if (value.includes("aberto") || value.includes("respondido")) return "info";
  return "ok";
}

function pill(status) {
  return `<span class="pill ${statusClass(status)}">${status}</span>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function setHash(hash) {
  const next = hash.startsWith("#") ? hash : `#${hash}`;
  if (window.location.hash !== next) history.pushState(null, "", next);
}

function hideOverlays() {
  drawer.classList.add("hidden");
  actionModal.classList.add("hidden");
}

function showLanding(hash = "inicio") {
  landing.classList.remove("hidden");
  prototype.classList.add("hidden");
  hideOverlays();
  setHash(hash);
  setTimeout(() => document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

function showLogin() {
  landing.classList.add("hidden");
  prototype.classList.remove("hidden");
  loginView.classList.remove("hidden");
  appShell.classList.add("hidden");
  hideOverlays();
  setHash("login");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showApp(screen = "dashboard") {
  state.screen = screen;
  landing.classList.add("hidden");
  prototype.classList.remove("hidden");
  loginView.classList.add("hidden");
  appShell.classList.remove("hidden");
  hideOverlays();
  setHash(screen);
  renderMenu();
  renderScreen(screen);
  applyAppLayout();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMenu() {
  sideMenu.innerHTML = screens
    .map((item) => `
      <button type="button" class="${item.id === state.screen ? "active" : ""}" data-action="nav-screen" data-screen="${item.id}" title="${item.label}">
        <span class="menu-icon">${item.icon}</span>
        <span class="menu-text">${item.label}</span>
      </button>
    `)
    .join("");
}

function applyAppLayout() {
  appShell.classList.toggle("sidebar-collapsed", state.sidebarCollapsed && !state.focusMode);
  appShell.classList.toggle("focus-mode", state.focusMode);
  document.querySelectorAll('[data-action="toggle-focus"]').forEach((button) => {
    button.textContent = state.focusMode ? "Sair do modo foco" : "Modo foco";
  });
  document.querySelectorAll('[data-action="toggle-sidebar-collapse"]').forEach((button) => {
    const label = state.sidebarCollapsed ? "Expandir menu" : "Recolher menu";
    button.title = label;
    button.setAttribute("aria-label", label);
  });
}

function renderScreen(screen) {
  const meta = screens.find((item) => item.id === screen) || screens[0];
  screenTitle.textContent = meta.title;
  screenEyebrow.textContent = meta.eyebrow;

  const renderers = {
    dashboard: renderDashboard,
    imports: renderImports,
    sales: () => renderDataScreen("sales"),
    operator: () => renderDataScreen("operator"),
    receivables: () => renderDataScreen("receivables"),
    deposits: () => renderDataScreen("deposits"),
    boletos: renderBoletos,
    rates: () => renderDataScreen("rates"),
    nfce: () => renderDataScreen("nfce"),
    ecommerce: () => renderDataScreen("ecommerce"),
    reconciliations: renderReconciliations,
    antifraud: renderAntifraud,
    reports: renderReports,
    ai: renderAi,
    support: renderSupport,
    technical: renderTechnical,
    settings: renderSettings,
  };

  appContent.innerHTML = (renderers[screen] || renderers.dashboard)();
}

function screenIntro(title, text, action = "") {
  const backAction = state.screen !== "dashboard"
    ? `<button class="secondary-button compact-button" type="button" data-action="nav-screen" data-screen="dashboard">Voltar ao dashboard</button>`
    : "";
  return `
    <div class="screen-intro">
      <p><strong>${title}.</strong> ${text}</p>
      ${(action || backAction) ? `<div class="toolbar">${action}${backAction}</div>` : ""}
    </div>
  `;
}

function renderCompanyStrip() {
  return `
    <div class="company-strip">
      <span><strong>Empresa</strong>Ox Comércio Demonstrativo LTDA</span>
      <span><strong>CNPJ</strong>12.345.678/0001-90</span>
      <span><strong>Cidade</strong>Maringá/PR</span>
      <span><strong>Plano</strong>Business</span>
    </div>
  `;
}

function renderFilters(filters = commonFilters) {
  const activeSummary = "Filtros ativos: 01/06/2026 a 15/06/2026 • Ox Comércio Demonstrativo LTDA • Todos os status";
  if (state.focusMode) return "";
  if (!state.filtersVisible) {
    return `
      <div class="filters-summary">
        <span>${activeSummary}</span>
        <button class="secondary-button compact-button" type="button" data-action="toggle-filters">Mostrar filtros</button>
      </div>
    `;
  }
  return `
    <div class="filters-shell">
      <div class="filters-heading">
        <span>${activeSummary}</span>
        <button class="secondary-button compact-button" type="button" data-action="toggle-filters">Ocultar filtros</button>
      </div>
      <div class="filter-bar dense">
        ${filters.map((filter) => `<label>${filter}<input type="text" value="${defaultFilterValue(filter)}" /></label>`).join("")}
        <button class="primary-button compact-button" type="button" data-action="apply-filters">Aplicar filtros</button>
        <button class="secondary-button compact-button" type="button" data-action="clear-filters">Limpar</button>
        <button class="secondary-button compact-button" type="button" data-action="export-report">Exportar relatório</button>
      </div>
    </div>
  `;
}

function defaultFilterValue(filter) {
  const values = {
    "Período": "01/06/2026 a 15/06/2026",
    "Empresa/CNPJ": "Ox Comércio Demonstrativo LTDA",
    "Empresa": "Ox Comércio Demonstrativo LTDA",
    "Loja": "Todas",
    "Operadora": "Todas",
    "Banco": "Todos",
    "Canal": "Todos",
    "Status": "Todos",
  };
  return values[filter] || "Todos";
}

function actionFor(label) {
  const value = normalize(label);
  if (value.includes("importar") || value.includes("nova importacao")) return "import-file";
  if (value.includes("validar layout")) return "validate-layout";
  if (value.includes("ver divergencias")) return "show-divergences";
  if (value.includes("ver boletos suspeitos")) return "show-suspect-boletos";
  if (value.includes("mapear")) return "map-columns";
  if (value === "processar") return "process-file";
  if (value.includes("reprocessar")) return "reprocess";
  if (value.includes("baixar")) return "download";
  if (value.includes("historico")) return "history";
  if (value.includes("abrir chamado") || value.includes("solicitar analise") || value.includes("validacao tecnica")) return "open-ticket";
  if (value.includes("ver detalhes") || value.includes("ver regra")) return "open-drawer";
  if (value.includes("perguntar")) return "ask-ai";
  if (value.includes("modo foco") || value.includes("sair do modo foco")) return "toggle-focus";
  if (value.includes("ocultar filtros") || value.includes("mostrar filtros")) return "toggle-filters";
  if (value.includes("recolher menu") || value.includes("expandir menu")) return "toggle-sidebar-collapse";
  if (value.includes("atualizar dados")) return "refresh-data";
  if (value.includes("confirmar fraude")) return "confirm-fraud";
  if (value.includes("descartar")) return "discard-suspicion";
  if (value.includes("ignorar")) return "ignore-justification";
  if (value.includes("conciliar automaticamente")) return "auto-reconcile";
  if (value.includes("conciliar manualmente") || value.includes("conciliar deposito") || value.includes("conciliar selecionadas") || value.includes("conciliar pedidos")) return "open-drawer";
  if (value.includes("aprovar ajuste")) return "approve-adjustment";
  if (value.includes("exportar") || value.includes("gerar relatorio") || value.includes("enviar por e-mail") || value.includes("agendar")) return "export-report";
  if (value.includes("criar regra") || value.includes("criar de-para") || value.includes("aplicar regra")) return "create-rule";
  if (value.includes("anexar")) return "attach-file";
  if (value.includes("salvar")) return "save-settings";
  if (value.includes("conectar")) return "connect-source";
  return "generic-action";
}

function renderActions(actions = []) {
  if (!actions.length) return "";
  return `
    <div class="toolbar action-strip">
      ${actions.map((label, index) => {
        const primary = index === 0 || normalize(label).includes("automaticamente") || normalize(label).includes("gerar");
        return `<button class="${primary ? "primary-button" : "secondary-button"} compact-button" type="button" data-action="${actionFor(label)}" data-label="${label}">${label}</button>`;
      }).join("")}
    </div>
  `;
}

function kpiTone(label) {
  const value = normalize(label);
  if (value.includes("conciliadas") || value.includes("liquido")) return "ok";
  if (value.includes("diverg") || value.includes("diferenca") || value.includes("taxas")) return "warn";
  if (value.includes("fraudes") || value.includes("suspeitos") || value.includes("nao encontradas")) return "danger";
  if (value.includes("recebido") || value.includes("confirmado")) return "info";
  return "neutral";
}

function kpiIcon(label) {
  const value = normalize(label);
  if (value.includes("vendido")) return "ERP";
  if (value.includes("operadoras")) return "OP";
  if (value.includes("liquido")) return "R$";
  if (value.includes("banco")) return "BC";
  if (value.includes("diferenca")) return "DV";
  if (value.includes("conciliadas")) return "OK";
  if (value.includes("divergentes")) return "!";
  if (value.includes("nao encontradas")) return "?";
  if (value.includes("boletos")) return "BL";
  if (value.includes("fraudes")) return "AF";
  if (value.includes("taxas")) return "%";
  return "ON";
}

function renderTablePanel(title, headers, rows) {
  return `
    <article class="table-card">
      <div class="table-heading">
        <h3>${title}</h3>
        <button class="secondary-button compact-button" type="button" data-action="expand-table">Expandir tabela</button>
      </div>
      ${renderTable(headers, rows)}
    </article>
  `;
}

function detailButton(label = "Ver detalhes", title = "Registro em análise") {
  return `<button class="row-action" type="button" data-action="open-drawer" data-title="${title}">${label}</button>`;
}

function renderTable(headers, rows) {
  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const needsAction = headers.includes("Ação");
            const cells = row.map((cell, index) => {
              const header = headers[index] || "";
              const shouldPill = /status|classificação|classificacao|risco|prioridade|nível|nivel/i.test(header);
              return `<td>${shouldPill ? pill(cell) : cell}</td>`;
            });
            if (needsAction && row.length < headers.length) cells.push(`<td>${detailButton()}</td>`);
            return `<tr>${cells.join("")}</tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderLineChart(data) {
  const width = 620;
  const height = 230;
  const padX = 46;
  const padY = 28;
  const values = data.map((item) => item.value);
  const min = Math.min(...values) * 0.92;
  const max = Math.max(...values) * 1.05;
  const points = data.map((item, index) => {
    const x = padX + (index * (width - padX * 2)) / (data.length - 1);
    const y = height - padY - ((item.value - min) / (max - min)) * (height - padY * 2);
    return { ...item, x, y };
  });
  const path = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");

  return `
    <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Receita por período de janeiro a junho">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#24B6AA" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#24B6AA" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g class="chart-grid-lines">
        ${[0, 1, 2, 3].map((line) => {
          const y = padY + (line * (height - padY * 2)) / 3;
          return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" />`;
        }).join("")}
      </g>
      <polygon points="${padX},${height - padY} ${path} ${width - padX},${height - padY}" fill="url(#lineFill)" />
      <polyline points="${path}" fill="none" stroke="#24B6AA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map((point) => `
        <circle cx="${point.x}" cy="${point.y}" r="5" />
        <text x="${point.x}" y="${height - 6}" text-anchor="middle">${point.month}</text>
      `).join("")}
    </svg>
  `;
}

function renderDonutChart(data) {
  let start = 0;
  const stops = data.map((item) => {
    const end = start + item.value;
    const segment = `${item.color} ${start}% ${end}%`;
    start = end;
    return segment;
  }).join(", ");

  return `
    <div class="reference-donut-wrap">
      <div class="reference-donut" style="background: conic-gradient(${stops});" aria-label="Distribuição por fonte"></div>
      <div class="reference-legend">
        ${data.map((item) => `
          <span><i style="background:${item.color}"></i>${item.label}<strong>${item.value}%</strong></span>
        `).join("")}
      </div>
    </div>
  `;
}

function renderAdvancedSummary() {
  return `
    <section class="advanced-summary ${state.advancedSummaryVisible ? "open" : ""}">
      <button class="advanced-summary-toggle" type="button" data-action="toggle-advanced-summary">
        <span>Resumo avançado</span>
        <strong>${state.advancedSummaryVisible ? "Ocultar" : "Mostrar"}</strong>
      </button>
      ${state.advancedSummaryVisible ? `
        <div class="advanced-summary-grid">
          ${dashboardKpis.map(([label, value, note]) => `
            <article class="advanced-summary-card ${kpiTone(label)}">
              <span>${label}</span>
              <strong>${value}</strong>
              <small>${note}</small>
            </article>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderDashboard() {
  return `
    <section class="reference-dashboard">
      ${renderCompanyStrip()}
      ${screenIntro("Clareza operacional", "Painel compacto para acompanhar receita, fontes, divergências e sinais de risco da conciliação financeira.", renderActions(["Nova importação", "Ver divergências", "Ver boletos suspeitos", "Gerar relatório", "Exportar PDF", "Exportar Excel", "Perguntar à IA", "Atualizar dados", state.filtersVisible ? "Ocultar filtros" : "Mostrar filtros", state.focusMode ? "Sair do modo foco" : "Modo foco"]))}
      ${renderFilters(commonFilters)}
      <div class="reference-kpi-grid">
        ${referenceKpis.map((item) => `
          <article class="reference-kpi-card ${item.tone}">
            <div>
              <span>${item.title}</span>
              <strong>${item.value}</strong>
              <small>${item.variation}</small>
            </div>
            <i>${item.icon}</i>
          </article>
        `).join("")}
      </div>
      <div class="reference-main-grid">
        <article class="reference-panel revenue-panel">
          <div class="reference-panel-head">
            <h3>Receita por Período</h3>
            <span>Jan - Jun</span>
          </div>
          ${renderLineChart(revenueData)}
        </article>
        <article class="reference-panel source-panel">
          <div class="reference-panel-head">
            <h3>Distribuição por Fonte</h3>
            <span>Base conciliada</span>
          </div>
          ${renderDonutChart(sourceDistribution)}
        </article>
      </div>
      <article class="reference-panel divergences-panel">
        <div class="reference-panel-head">
          <h3>Últimas Divergências</h3>
          <button class="secondary-button compact-button" type="button" data-action="expand-table">Expandir tabela</button>
        </div>
        ${renderTable(["Data", "Origem", "Descrição", "Valor", "Status"], latestDivergences)}
      </article>
      ${renderAdvancedSummary()}
    </section>
  `;
}

function renderImports() {
  return `
    ${screenIntro("Importações", "Simule a entrada manual de arquivos financeiros. Não conseguimos interpretar esse arquivo? Mapeie a coluna correta ou envie para análise técnica.", renderActions(["Importar arquivo", "Validar layout", "Mapear colunas", "Processar", "Reprocessar", "Baixar modelo CSV", "Ver histórico", "Abrir chamado técnico"]))}
    <div class="upload-panel">
      <div>
        <strong>Tipos aceitos</strong>
        <p>Vendas ERP/PDV, transações de operadora, agenda de recebíveis, extrato bancário, CNAB, OFX, boletos, NFC-e, e-commerce e taxas contratadas.</p>
      </div>
      <button class="primary-button" type="button" data-action="import-file">Importar arquivo</button>
    </div>
    <article class="table-card">
      <h3>Arquivos importados</h3>
      ${renderTable(["Nome do arquivo", "Tipo", "Origem", "Data de upload", "Registros lidos", "Registros válidos", "Registros com erro", "Status", "Usuário", "Ação"], state.imports)}
    </article>
  `;
}

function renderDataScreen(id) {
  const table = tables[id];
  return `
    ${screenIntro(table.description, "Identificamos o que está certo, o que está divergente e o que precisa de atenção. Menos conferência manual, mais confiança nos dados.")}
    ${renderFilters(table.filters)}
    ${renderActions(table.actions)}
    ${renderTablePanel(screens.find((item) => item.id === id)?.title || "Dados", table.headers, table.rows)}
  `;
}

function renderBoletos() {
  const table = tables.boletos;
  return `
    ${screenIntro(table.description, "Esse boleto foi marcado como suspeito por regra de segurança. Revise os dados antes de confirmar a conciliação.")}
    ${renderFilters(table.filters)}
    ${renderActions(table.actions)}
    <div class="mini-card-grid">
      <article class="mini-card"><span>Conciliados</span><strong>186</strong></article>
      <article class="mini-card"><span>Divergentes</span><strong>3</strong></article>
      <article class="mini-card"><span>Suspeitos</span><strong>6</strong></article>
      <article class="mini-card"><span>Possíveis fraudes</span><strong>2</strong></article>
      <article class="mini-card"><span>Em análise</span><strong>4</strong></article>
    </div>
    ${renderTablePanel("Boletos", table.headers, table.rows)}
  `;
}

function renderReconciliations() {
  const table = tables.reconciliations;
  return `
    ${screenIntro(table.description, "A tela central cruza origem, valor esperado, valor encontrado, diferença, confiança e ação recomendada.")}
    ${renderFilters(table.filters)}
    ${renderActions(table.actions)}
    ${renderTablePanel("Conciliações", table.headers, table.rows)}
    <article class="table-card" style="margin-top:14px">
      <h3>Regras de negócio simuladas</h3>
      <ul class="business-rules">
        <li><strong>Venda conciliada:</strong> mesmo NSU, autorização, valor e data aproximada.</li>
        <li><strong>Venda divergente:</strong> correspondência encontrada, mas valor, bandeira, parcela ou operadora diferente.</li>
        <li><strong>Pagamento conciliado:</strong> valor líquido previsto bate com depósito bancário.</li>
        <li><strong>Pagamento divergente:</strong> diferença maior que R$ 0,10.</li>
        <li><strong>Taxa divergente:</strong> taxa cobrada maior que taxa contratada.</li>
        <li><strong>Possível fraude:</strong> beneficiário, conta bancária ou linha digitável diferente do esperado.</li>
      </ul>
    </article>
  `;
}

function renderAntifraud() {
  const alerts = [
    ["ALT-001", "Beneficiário divergente", "100246", "Beneficiário informado não corresponde ao cadastro", "Alto", "R$ 1.200,00", "Validar com banco/ERP", state.fraudConfirmed ? "Fraude confirmada" : "Pendente"],
    ["ALT-002", "Duplicidade", "100251", "Nosso número repetido", "Médio", "R$ 680,00", "Revisar emissão", "Em análise"],
    ["ALT-003", "Valor divergente", "100247", "Valor pago menor que emitido", "Médio", "R$ 50,00", "Conferir baixa parcial", "Pendente"],
  ];
  return `
    ${screenIntro("Antifraude", "Tela focada em riscos, alertas e análise de boletos suspeitos.", renderActions(["Rodar análise", "Ver regras aplicadas", "Confirmar fraude", "Marcar como falso positivo", "Solicitar validação técnica", "Exportar dossiê", "Perguntar à IA"]))}
    <div class="mini-card-grid">
      <article class="mini-card"><span>Alertas ativos</span><strong>11</strong></article>
      <article class="mini-card"><span>Possíveis fraudes</span><strong>2</strong></article>
      <article class="mini-card"><span>Boletos suspeitos</span><strong>6</strong></article>
      <article class="mini-card"><span>Divergências de valor</span><strong>3</strong></article>
      <article class="mini-card"><span>Duplicidades</span><strong>1</strong></article>
    </div>
    ${renderTablePanel("Lista de alertas", ["Alerta", "Tipo", "Boleto", "Regra acionada", "Nível de risco", "Valor", "Ação recomendada", "Status", "Ação"], alerts)}
  `;
}

function renderReports() {
  return `
    ${screenIntro("Relatórios", "A OxNexus não promete valor. Ela prova o valor entregue.", renderActions(["Gerar relatório mensal", "Exportar PDF", "Exportar Excel", "Enviar por e-mail", "Agendar envio", "Ver histórico"]))}
    <div class="mini-card-grid">
      <article class="mini-card"><span>Horas manuais antes</span><strong>42h/mês</strong></article>
      <article class="mini-card"><span>Horas após OxNexus</span><strong>12h/mês</strong></article>
      <article class="mini-card"><span>Redução estimada</span><strong>30h/mês</strong></article>
      <article class="mini-card"><span>Valor divergente</span><strong>R$ 8.430,30</strong></article>
      <article class="mini-card"><span>Relatórios gerados</span><strong>18</strong></article>
    </div>
    ${renderTablePanel("Modelos disponíveis", ["Relatório", "Foco", "Periodicidade", "Status", "Ação"], [
        ["Resumo de conciliação", "Executivo", "Mensal", "Finalizado"],
        ["Divergências por operadora", "Operadoras", "Semanal", "Em análise"],
        ["Taxas cobradas a maior", "Taxas", "Mensal", "Finalizado"],
        ["Boletos suspeitos", "Antifraude", "Diário", "Finalizado"],
        ["Depósitos não identificados", "Banco", "Semanal", "Pendente"],
        ["Economia estimada", "Valor entregue", "Mensal", "Finalizado"],
      ])}
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
          ${[
            "Por que esse boleto está suspeito?",
            "O que significa venda não encontrada?",
            "Como corrigir taxa divergente?",
            "Por que o depósito está diferente do recebível?",
            "Como funciona a conciliação automática?",
            "Como abrir um chamado técnico?",
          ].map((question) => `<button type="button" data-question="${question}">${question}</button>`).join("")}
        </div>
      </aside>
    </div>
  `;
}

function renderSupport() {
  return `
    ${screenIntro("Suporte", "Abra solicitações com contexto financeiro, categoria, prioridade e registro relacionado.", renderActions(["Abrir chamado", "Anexar comprovante", "Solicitar reprocessamento", "Enviar dúvida", "Ver chamados", "Fechar chamado"]))}
    <div class="support-layout">
      <form class="form-panel" id="ticketForm">
        <h3>Abrir solicitação</h3>
        <label>Categoria<select name="category"><option>Dúvida de uso</option><option>Erro de importação</option><option>Divergência financeira</option><option>Boleto suspeito</option><option>Novo CNPJ</option><option>Nova operadora</option><option>Problema técnico</option></select></label>
        <label>Prioridade<select name="priority"><option>Média</option><option>Alta</option><option>Baixa</option></select></label>
        <label>Registro relacionado<input name="related" value="Boleto 100246" /></label>
        <label>Descrição<input name="summary" value="Preciso revisar uma divergência financeira" /></label>
        <button class="primary-button full" type="submit">Abrir chamado</button>
      </form>
      <article class="support-card">
        <h3>Lista de chamados</h3>
        ${renderTable(["Chamado", "Categoria", "Prioridade", "Status", "Responsável", "Última atualização"], state.tickets)}
      </article>
    </div>
  `;
}

function renderTechnical() {
  return `
    ${screenIntro("Área técnica", "Apenas para analista técnico. Acompanhe logs, mapeamentos, erros de layout e histórico de reprocessamento.", renderActions(["Ver logs", "Reprocessar arquivo", "Baixar arquivo original", "Ver regra aplicada", "Alterar mapeamento", "Criar de-para", "Reabrir processamento", "Marcar como resolvido"]))}
    <div class="technical-grid">
      <article class="technical-card">
        <h3>Logs de importação</h3>
        <div class="log-list">
          <div class="log-item"><strong>boletos_emitidos.csv</strong><span>Não conseguimos identificar a coluna NSU neste arquivo. Mapeie a coluna correta ou envie para análise técnica.</span></div>
          <div class="log-item"><strong>cielo_recebiveis_junho.csv</strong><span>5 registros foram importados com divergência de taxa.</span></div>
          <div class="log-item"><strong>extrato_itau_0106.ofx</strong><span>96 registros lidos e 1 depósito marcado como não identificado.</span></div>
        </div>
      </article>
      <article class="technical-card">
        <h3>Regras aplicadas</h3>
        <div class="log-list">
          <div class="log-item"><strong>NSU + autorização</strong><span>Usada para conciliar venda ERP/PDV com transação da operadora.</span></div>
          <div class="log-item"><strong>Tolerância R$ 0,10</strong><span>Diferença acima desse valor entra na fila de análise.</span></div>
          <div class="log-item"><strong>Beneficiário autorizado</strong><span>Compara beneficiário informado com cadastro da empresa.</span></div>
        </div>
      </article>
    </div>
    <article class="table-card" style="margin-top:14px">
      <h3>Histórico de reprocessamento</h3>
      ${renderTable(["Arquivo", "Regra", "Antes", "Depois", "Status", "Ação"], [
        ["cielo_recebiveis_junho.csv", "Taxa contratada", "5 erros", "2 erros", "Corrigido"],
        ["boletos_emitidos.csv", "Mapeamento NSU", "4 erros", "Reprocessando", "Reprocessando"],
        ["extrato_itau_0106.ofx", "Vínculo por lote", "1 pendência", "1 pendência", "Em análise"],
      ])}
    </article>
  `;
}

function renderSettings() {
  return `
    ${screenIntro("Configurações", "Defina dados da empresa, usuários, permissões, contas bancárias, taxas e parâmetros de risco.", renderActions(["Salvar alterações", "Adicionar empresa", "Adicionar CNPJ", "Adicionar usuário", "Cadastrar conta bancária", "Cadastrar taxa", "Configurar tolerância", "Ativar notificações"]))}
    <div class="settings-grid">
      <article class="setting-card">
        <h3>Dados mockados obrigatórios</h3>
        <div class="settings-list">
          <div class="settings-item"><strong>Empresa</strong><span>Ox Comércio Demonstrativo LTDA - 12.345.678/0001-90 - Maringá/PR - Plano Business</span></div>
          <div class="settings-item"><strong>Usuários</strong><span>Gabriel de Melo, Samuel Yuiti, Mateus Sobral, Lucas Henrique e Tiago Schult.</span></div>
          <div class="settings-item"><strong>Operadoras</strong><span>Cielo, Rede, Stone, Getnet, Mercado Pago e Pagar.me.</span></div>
          <div class="settings-item"><strong>Bancos</strong><span>Itaú, Sicredi, Banco do Brasil e Caixa.</span></div>
          <div class="settings-item"><strong>Canais</strong><span>Loja física, e-commerce, marketplace, boleto, Pix, cartão crédito e cartão débito.</span></div>
        </div>
      </article>
      <form class="setting-card settings-form">
        <h3>Parâmetros de conciliação</h3>
        <label>Tolerância de diferença<input value="R$ 0,10" /></label>
        <label>Notificações por e-mail<select><option>Ativas para divergências e risco alto</option><option>Apenas risco alto</option><option>Desativadas</option></select></label>
        <label>Parâmetros de risco<select><option>Beneficiário, conta, linha digitável e duplicidade</option><option>Somente risco alto</option></select></label>
        <button class="primary-button full" type="button" data-action="save-settings">Salvar alterações</button>
      </form>
    </div>
  `;
}

function resetDrawerPrimary(action = "confirm-review", label = "Marcar como revisado") {
  const drawerPrimary = drawer.querySelector(".primary-button.full");
  if (!drawerPrimary) return;
  drawerPrimary.dataset.action = action;
  drawerPrimary.textContent = label;
}

function renderDefaultDrawerList() {
  const drawerList = drawer.querySelector(".drawer-list");
  if (!drawerList) return;
  drawerList.innerHTML = `
    <span>Valor esperado: R$ 4.920,00</span>
    <span>Valor encontrado: R$ 4.874,80</span>
    <span>Diferença: R$ 45,20</span>
    <span>Ação recomendada: revisar taxa cobrada</span>
  `;
}

function openDrawer(title = "Registro em análise") {
  drawer.classList.remove("ai-drawer");
  drawerTitle.textContent = title;
  drawerText.textContent = "Encontramos divergências que precisam da sua atenção. Revise os dados antes de confirmar a conciliação.";
  renderDefaultDrawerList();
  resetDrawerPrimary();
  drawer.classList.remove("hidden");
}

function openAiDrawer() {
  drawer.classList.add("ai-drawer");
  drawerTitle.textContent = "IA OxNexus";
  drawerText.textContent = "Faça uma pergunta sobre o dashboard atual ou use uma das perguntas rápidas para explicar divergências, boletos e recebíveis.";
  const drawerList = drawer.querySelector(".drawer-list");
  if (drawerList) {
    drawerList.innerHTML = `
      <div class="drawer-chat-message ai">Estou analisando os dados demonstrativos de 01/06/2026 a 15/06/2026. Escolha uma pergunta ou abra a tela completa da IA.</div>
      <button class="drawer-question" type="button" data-ai-drawer-question="Quais divergências precisam de atenção hoje?">Quais divergências precisam de atenção hoje?</button>
      <button class="drawer-question" type="button" data-ai-drawer-question="Por que existem boletos suspeitos?">Por que existem boletos suspeitos?</button>
      <button class="drawer-question" type="button" data-ai-drawer-question="Como reduzir diferença entre ERP e banco?">Como reduzir diferença entre ERP e banco?</button>
    `;
  }
  resetDrawerPrimary("ask-ai-screen", "Abrir tela completa da IA");
  drawer.classList.remove("hidden");
}

function answerAiDrawer(question) {
  const drawerList = drawer.querySelector(".drawer-list");
  if (!drawerList) return;
  drawerList.innerHTML = `
    <div class="drawer-chat-message user">${question}</div>
    <div class="drawer-chat-message ai">${aiAnswer(question)}</div>
    <button class="drawer-question" type="button" data-ai-drawer-question="Quais divergências precisam de atenção hoje?">Perguntar sobre divergências</button>
    <button class="drawer-question" type="button" data-ai-drawer-question="Por que existem boletos suspeitos?">Perguntar sobre boletos</button>
  `;
}

function openModal(title, body, footer = "") {
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modalFooter.innerHTML = footer || `<button class="primary-button compact-button" type="button" data-action="close-modal">Entendi</button>`;
  actionModal.classList.remove("hidden");
}

function openUploadModal() {
  openModal(
    "Importar arquivo",
    `
      <p>Selecione o tipo de arquivo e simule o envio. O protótipo não envia dados reais.</p>
      <label>Tipo de arquivo<select><option>Vendas ERP/PDV</option><option>Transações de operadora</option><option>Agenda de recebíveis</option><option>Extrato bancário</option><option>CNAB</option><option>OFX</option><option>Boletos</option><option>NFC-e</option><option>E-commerce</option><option>Taxas contratadas</option></select></label>
      <label>Arquivo<input type="text" value="novo_arquivo_demo.csv" /></label>
      <p>Microtexto: vamos validar layout, mapear colunas e processar apenas dados fictícios.</p>
    `,
    `<button class="primary-button compact-button" type="button" data-action="process-file">Processar</button><button class="secondary-button compact-button" type="button" data-action="close-modal">Cancelar</button>`
  );
}

function openTicketModal() {
  openModal(
    "Abrir chamado",
    `
      <label>Categoria<select><option>Divergência financeira</option><option>Erro de importação</option><option>Boleto suspeito</option><option>Novo CNPJ</option><option>Problema técnico</option></select></label>
      <label>Prioridade<select><option>Média</option><option>Alta</option><option>Baixa</option></select></label>
      <label>Registro relacionado<input value="NSU 82742" /></label>
      <label>Descrição<input value="Preciso de apoio para revisar essa divergência." /></label>
    `,
    `<button class="primary-button compact-button" type="button" data-action="submit-ticket">Abrir chamado</button><button class="secondary-button compact-button" type="button" data-action="close-modal">Cancelar</button>`
  );
}

function openJustificationModal() {
  openModal(
    "Ignorar com justificativa",
    `
      <p>Informe por que esse registro pode ser ignorado. A justificativa fica no histórico da conciliação.</p>
      <textarea placeholder="Ex.: diferença autorizada pelo financeiro após validação do lote."></textarea>
    `,
    `<button class="primary-button compact-button" type="button" data-action="save-justification">Registrar justificativa</button><button class="secondary-button compact-button" type="button" data-action="close-modal">Cancelar</button>`
  );
}

function processImport() {
  state.imports.unshift(["novo_arquivo_demo.csv", "Vendas ERP/PDV", "PDV", "16/06/2026", "128", "128", "0", "Reprocessando", "Samuel Yuiti"]);
  actionModal.classList.add("hidden");
  showToast("Arquivo demonstrativo entrou como Reprocessando.");
  if (state.screen === "imports") renderScreen("imports");
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
  const q = normalize(question);
  if (q.includes("boleto")) return "Esse boleto foi marcado como possível fraude porque o beneficiário informado não corresponde ao beneficiário cadastrado para essa empresa.";
  if (q.includes("nao encontrada") || q.includes("nao encontrado")) return "Essa venda está como não encontrada porque existe registro em uma origem, mas não localizamos correspondência com mesmo NSU, valor ou data aproximada.";
  if (q.includes("taxa")) return "A taxa cobrada foi maior que a taxa contratada. Compare bandeira, modalidade e parcelas antes de aprovar o ajuste.";
  if (q.includes("deposito") || q.includes("recebivel")) return "A diferença no depósito pode estar relacionada a taxa divergente, antecipação, cancelamento, chargeback ou lote bancário agrupado.";
  if (q.includes("automatica")) return "A conciliação automática usa regras de NSU, autorização, valor, data aproximada e tolerância de R$ 0,10.";
  if (q.includes("chamado")) return "Abra um chamado informando categoria, prioridade, descrição e o registro relacionado. A área técnica recebe o contexto da tela.";
  return "Revise a origem do registro, confira valores, NSU, autorização e lote bancário. Se a diferença persistir, abra um chamado técnico.";
}

function revealDashboardDivergences() {
  state.filtersVisible = true;
  localStorage.setItem("oxnexus.filtersVisible", "true");
  if (state.screen !== "dashboard") {
    showApp("dashboard");
  } else {
    renderScreen("dashboard");
  }
  setTimeout(() => {
    document.querySelector(".divergences-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
  showToast("Divergências exibidas com filtros ativos.");
}

function refreshDashboardData() {
  const refreshButtons = document.querySelectorAll('[data-action="refresh-data"]');
  refreshButtons.forEach((button) => {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Atualizando...";
  });
  showToast("Atualizando dados demonstrativos...");
  setTimeout(() => {
    if (state.screen === "dashboard") renderScreen("dashboard");
    showToast("Dados atualizados.");
  }, 650);
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
  const aiDrawerQuestion = event.target.closest("[data-ai-drawer-question]");
  if (aiDrawerQuestion) {
    answerAiDrawer(aiDrawerQuestion.dataset.aiDrawerQuestion);
    return;
  }

  const questionButton = event.target.closest("[data-question]");
  if (questionButton) {
    askAi(questionButton.dataset.question);
    return;
  }

  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const label = target.dataset.label || target.textContent.trim();

  if (action === "open-login") showLogin();
  if (action === "open-demo") {
    showApp("dashboard");
    showToast("Demonstração carregada com dados fictícios realistas.");
  }
  if (action === "back-home") showLanding("inicio");
  if (action === "forgot") showToast("Fluxo simulado de recuperação enviado para o e-mail de demonstração.");
  if (action === "logout") showLogin();
  if (action === "nav-screen") showApp(target.dataset.screen);
  if (action === "toggle-menu") document.querySelector(".sidebar").classList.toggle("open");
  if (action === "toggle-sidebar-collapse") {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    localStorage.setItem("oxnexus.sidebarCollapsed", String(state.sidebarCollapsed));
    applyAppLayout();
    if (state.screen === "dashboard") renderScreen("dashboard");
  }
  if (action === "toggle-focus") {
    state.focusMode = !state.focusMode;
    if (state.focusMode) {
      state.filtersBeforeFocus = state.filtersVisible;
      state.filtersVisible = false;
    } else {
      state.filtersVisible = state.filtersBeforeFocus;
    }
    applyAppLayout();
    renderScreen(state.screen);
  }
  if (action === "toggle-filters") {
    state.filtersVisible = !state.filtersVisible;
    localStorage.setItem("oxnexus.filtersVisible", String(state.filtersVisible));
    renderScreen(state.screen);
    showToast(state.filtersVisible ? "Filtros exibidos." : "Filtros ocultos para ampliar a área útil.");
  }
  if (action === "toggle-advanced-summary") {
    state.advancedSummaryVisible = !state.advancedSummaryVisible;
    localStorage.setItem("oxnexus.advancedSummaryVisible", String(state.advancedSummaryVisible));
    renderScreen(state.screen);
  }
  if (action === "technical") showApp("technical");
  if (action === "ask-ai") openAiDrawer();
  if (action === "ask-ai-screen") {
    drawer.classList.add("hidden");
    showApp("ai");
  }
  if (action === "show-divergences") revealDashboardDivergences();
  if (action === "show-suspect-boletos") {
    showApp("boletos");
    showToast("Boletos suspeitos carregados para revisão.");
  }
  if (action === "contact") showToast("Solicitação registrada. Um especialista entraria em contato nesta etapa.");
  if (action === "import-file") openUploadModal();
  if (action === "validate-layout") openModal("Validar layout", "<p>Layout validado com alertas. Não conseguimos interpretar algumas colunas; revise o mapeamento antes de processar.</p>");
  if (action === "map-columns") openModal("Mapear colunas", "<p>Mapeie NSU, autorização, valor, data, lote, beneficiário e status para melhorar a conciliação.</p>");
  if (action === "process-file" || action === "reprocess") processImport();
  if (action === "download") showToast("Download simulado gerado para demonstração.");
  if (action === "history") openModal("Histórico", "<p>Últimos processamentos: 4 arquivos finalizados, 1 em análise e 1 reprocessando.</p>");
  if (action === "open-ticket") openTicketModal();
  if (action === "submit-ticket") {
    state.tickets.unshift(["CH-1048", "Divergência financeira", "Média", "Aberto", "Samuel Yuiti", "16/06/2026 10:14"]);
    actionModal.classList.add("hidden");
    showToast("Chamado aberto com contexto financeiro da tela.");
    if (state.screen === "support") renderScreen("support");
  }
  if (action === "open-drawer") openDrawer(target.dataset.title || label || "Registro em análise");
  if (action === "close-drawer") drawer.classList.add("hidden");
  if (action === "close-modal") actionModal.classList.add("hidden");
  if (action === "confirm-review") {
    drawer.classList.add("hidden");
    showToast("Registro marcado como revisado no protótipo.");
  }
  if (action === "confirm-fraud") {
    state.fraudConfirmed = true;
    showToast("Status alterado para Fraude confirmada.");
    if (["boletos", "antifraud", "reconciliations", "dashboard"].includes(state.screen)) renderScreen(state.screen);
  }
  if (action === "discard-suspicion") {
    state.fraudConfirmed = false;
    showToast("Suspeita descartada como falso positivo.");
    if (["boletos", "antifraud", "reconciliations", "dashboard"].includes(state.screen)) renderScreen(state.screen);
  }
  if (action === "ignore-justification") openJustificationModal();
  if (action === "save-justification") {
    actionModal.classList.add("hidden");
    showToast("Justificativa registrada no histórico.");
  }
  if (action === "auto-reconcile") showToast("Conciliação automática simulada com tolerância de R$ 0,10.");
  if (action === "approve-adjustment") showToast("Ajuste aprovado no protótipo.");
  if (action === "export-report") showToast(`${label} gerado no protótipo.`);
  if (action === "create-rule") openModal("Criar regra", "<p>Regra criada para aproximar NSU, autorização, valor e data. O próximo reprocessamento usará esse critério.</p>");
  if (action === "attach-file") showToast("Comprovante anexado visualmente ao chamado.");
  if (action === "save-settings") showToast("Configurações salvas no protótipo.");
  if (action === "connect-source") openModal("Conectar fonte", "<p>Integrações reais não fazem parte desta versão. A fonte fica simulada com dados mockados.</p>");
  if (action === "apply-filters") showToast("Filtros aplicados aos dados fictícios.");
  if (action === "clear-filters") showToast("Filtros limpos.");
  if (action === "refresh-data") refreshDashboardData();
  if (action === "expand-table") {
    const tableCard = target.closest(".table-card, .reference-panel");
    tableCard?.classList.toggle("expanded-table");
    target.textContent = tableCard?.classList.contains("expanded-table") ? "Reduzir tabela" : "Expandir tabela";
  }
  if (action === "send-ai") {
    const input = document.querySelector("#aiInput");
    askAi(input ? input.value : "");
  }
  if (action === "generic-action") showToast(`${label} executado visualmente no protótipo.`);
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
  state.tickets.unshift([
    `CH-${1049 + state.tickets.length}`,
    form.get("category"),
    form.get("priority"),
    "Aberto",
    "Samuel Yuiti",
    "16/06/2026 10:18",
  ]);
  renderScreen("support");
  showToast("Chamado aberto com contexto financeiro da tela.");
});

window.addEventListener("popstate", routeFromHash);
routeFromHash();
