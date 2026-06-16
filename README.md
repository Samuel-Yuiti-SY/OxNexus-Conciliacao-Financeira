# OxNexus — Conciliadora Financeira

Landing page e protótipo interativo da **OxNexus**, uma plataforma SaaS de conciliação financeira inteligente.

A proposta da OxNexus é transformar dados financeiros dispersos em confiança para decisão, ajudando empresas a validarem se aquilo que foi **vendido, cobrado, pago, tributado e recebido** realmente está correto.

---

## Visão geral

Empresas vendem todos os dias, mas nem sempre conseguem saber com segurança se receberam corretamente.

Na rotina financeira, as informações podem ficar espalhadas entre ERP, banco, operadora, boletos, NFC-e, e-commerce, gateways e planilhas. Isso gera conferência manual, retrabalho, atrasos, divergências e risco de fraudes.

A OxNexus centraliza essas informações em uma experiência única, permitindo visualizar:

* vendas registradas;
* transações de operadoras;
* agenda de recebíveis;
* depósitos bancários;
* boletos;
* taxas;
* NFC-e;
* pedidos de e-commerce;
* divergências;
* possíveis fraudes;
* relatórios de conciliação.

---

## Site publicado

A versão publicada do projeto está disponível em:

```txt
https://oxnexus-conciliacao-financeira.vercel.app
```

---

## Repositório

```txt
https://github.com/Samuel-Yuiti-SY/OxNexus-Conciliacao-Financeira
```

---

## Tecnologias utilizadas

O projeto foi desenvolvido como uma aplicação web estática com foco em prototipação, apresentação comercial e validação visual.

Tecnologias:

* HTML5
* CSS3
* JavaScript
* Vite
* Vercel

---

## Como executar localmente

Para rodar o projeto localmente, é necessário ter o **Node.js** instalado.

### 1. Clone o repositório

```bash
git clone https://github.com/Samuel-Yuiti-SY/OxNexus-Conciliacao-Financeira.git
```

### 2. Acesse a pasta do projeto

```bash
cd OxNexus-Conciliacao-Financeira
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor local

```bash
npm run dev
```

Após executar o comando, o terminal exibirá o endereço local da aplicação, normalmente:

```txt
http://localhost:5173
```

---

## Scripts disponíveis

```bash
npm run dev
```

Inicia o ambiente local de desenvolvimento.

```bash
npm run build
```

Gera a versão otimizada para produção.

```bash
npm run preview
```

Executa uma prévia local da versão de produção.

---

## Acesso de demonstração

Use as credenciais abaixo para acessar o protótipo:

```txt
E-mail: admin@oxnexus.com
Senha: 123456
```

---

## O que está incluído

### Landing page

A landing page apresenta a proposta da OxNexus com uma comunicação voltada para empresas que precisam melhorar a confiança nos próprios dados financeiros.

Seções principais:

* apresentação da marca;
* dor do mercado;
* funcionamento de uma conciliadora financeira;
* solução OxNexus;
* módulos da plataforma;
* antifraude de boletos;
* IA contextual;
* público-alvo;
* planos comerciais;
* prova de valor;
* chamada para ação.

---

### Protótipo interativo

O protótipo simula uma plataforma real de conciliação financeira, com navegação lateral, telas internas, dados fictícios e ações visuais.

Telas incluídas:

* Login
* Dashboard executivo
* Importações
* Vendas ERP/PDV
* Transações de operadora
* Recebíveis
* Depósitos bancários
* Boletos
* Taxas
* NFC-e
* E-commerce
* Conciliações
* Antifraude
* Relatórios
* IA OxNexus
* Suporte
* Área técnica
* Configurações

---

## Funcionalidades simuladas

O protótipo possui dados fictícios realistas e interações visuais para demonstrar o funcionamento da plataforma.

Funcionalidades incluídas:

* login demonstrativo;
* menu lateral navegável;
* dashboard com indicadores financeiros;
* filtros por período, empresa, loja, banco, operadora, canal e status;
* importação simulada de arquivos;
* validação de layout;
* mapeamento de colunas;
* visualização de divergências;
* análise de boletos suspeitos;
* confirmação de possível fraude;
* abertura de chamados;
* reprocessamento visual de dados;
* consulta à IA contextual;
* geração visual de relatórios;
* modo de visualização mais limpo;
* área técnica com logs e regras aplicadas.

---

## Regras de negócio simuladas

A OxNexus utiliza regras simuladas para representar o comportamento de uma conciliadora financeira real.

### Venda conciliada

Uma venda é considerada conciliada quando os dados do ERP/PDV e da operadora possuem correspondência por NSU, autorização, valor e data aproximada.

### Venda divergente

Uma venda é marcada como divergente quando existe correspondência entre as fontes, mas há diferença em valor, bandeira, parcela, operadora ou status.

### Venda não encontrada

Uma venda é classificada como não encontrada quando existe registro no ERP sem retorno correspondente na operadora, ou quando existe transação na operadora sem venda correspondente no ERP.

### Pagamento conciliado

Um pagamento é conciliado quando o valor líquido previsto na agenda de recebíveis bate com o depósito bancário identificado.

### Pagamento divergente

Um pagamento é considerado divergente quando a diferença entre o valor previsto e o valor recebido é superior à tolerância configurada.

### Taxa divergente

Uma taxa é marcada como divergente quando a taxa cobrada pela operadora é maior que a taxa contratada cadastrada na plataforma.

### Boleto suspeito

Um boleto pode ser classificado como suspeito quando há duplicidade, divergência de valor, ausência de registro interno, vencimento alterado ou inconsistência nos dados importados.

### Possível fraude

Um boleto pode ser marcado como possível fraude quando beneficiário, conta bancária ou linha digitável não correspondem ao cadastro esperado.

### NFC-e divergente

Uma NFC-e é marcada como divergente quando existe documento fiscal sem venda vinculada, venda sem documento fiscal ou NFC-e cancelada com pagamento ativo.

### E-commerce divergente

Um pedido de e-commerce pode ser classificado como divergente quando há pedido cancelado com pagamento confirmado, pagamento aprovado não recebido, reembolso não conciliado ou chargeback em aberto.

---

## Dados demonstrativos

O protótipo utiliza dados fictícios para simular uma operação financeira real.

Empresa demonstrativa:

```txt
Ox Comércio Demonstrativo LTDA
CNPJ: 12.345.678/0001-90
Cidade: Maringá/PR
Plano: Business
```

Usuários demonstrativos:

* Gabriel de Melo — CEO/Admin
* Samuel Yuiti — CTO/Admin técnico
* Mateus Sobral — Produto/Negócio
* Lucas Henrique — Engenheiro de Dados
* Tiago Schult — Backend/Integrações

Operadoras simuladas:

* Cielo
* Rede
* Stone
* Getnet
* Mercado Pago
* Pagar.me

Bancos simulados:

* Itaú
* Sicredi
* Banco do Brasil
* Caixa

---

## Identidade visual

A interface segue a identidade visual da OxNexus, com aparência de fintech/SaaS e foco em clareza, confiança e tecnologia.

Paleta utilizada:

```txt
Azul institucional: #2A5488
Azul escuro: #152943
Azul profundo: #061323
Teal: #24B6AA
Verde claro: #C0DCCA
Cinza claro: #E0E4E8
Branco suave: #F7FAFF
Laranja de alerta: #FFB547
Vermelho de risco: #FF5D5D
Azul informativo: #18A7FF
```

---

## Publicação na Vercel

O projeto está configurado para publicação como site estático na Vercel.

Arquivo de configuração:

```txt
vercel.json
```

Esse arquivo define configurações básicas para servir a experiência web com URLs limpas e headers apropriados.

Para publicar:

1. Faça o push do projeto para o GitHub.
2. Acesse a Vercel.
3. Importe o repositório.
4. Configure o projeto como site estático.
5. Publique.

---

## Estrutura de arquivos

```txt
OxNexus-Conciliacao-Financeira/
│
├── index.html
├── styles.css
├── app.js
├── package.json
├── vercel.json
├── README.md
│
└── assets/
    └── oxnexus-logo-dark.png
```

---

## Nome do projeto

```txt
OxNexus - Conciliadora Financeira
```

Slug público:

```txt
OxNexus-Conciliacao-Financeira
```

---

## Próximos passos

Evoluções previstas para as próximas versões:

* autenticação real de usuários;
* backend em Java com Spring Boot;
* banco de dados PostgreSQL;
* importação real de arquivos CSV, Excel, CNAB e OFX;
* integração com APIs bancárias;
* integração com ERPs;
* integração com operadoras e gateways;
* motor real de conciliação;
* antifraude com validações externas;
* geração real de relatórios;
* trilha de auditoria;
* permissões por perfil;
* painel administrativo para suporte e análise técnica.

---

## Objetivo do projeto

Este projeto foi criado para apresentar a OxNexus como uma solução real de conciliação financeira, demonstrando sua proposta de valor, experiência de uso, identidade visual e principais fluxos operacionais.

A OxNexus existe para responder uma pergunta essencial:

```txt
Eu realmente recebi o que vendi?
```

A resposta vem com clareza, segurança e confiança financeira.
