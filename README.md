<h1 align="center">📊 DataSocial — Governança MROSC & Investimento Social Inteligente</h1>

<p align="center">
  <em>Plataforma integrada de avaliação de maturidade de ONGs, gestão de projetos para captação de recursos via Leis de Incentivo e alocação estratégica de investimentos sociais privados com sincronização em tempo real no Google Sheets.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Plataforma-DataSocial-1B2A4A?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Integra%C3%A7%C3%A3o-Google%20Sheets%20v4-34A853?style=for-the-badge&logo=googlesheets"/>
  <img src="https://img.shields.io/badge/Leis%20de%20Incentivo-FIA%20%7C%20Rouanet%20%7C%20Esporte-FF6B35?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Tailwind-3776AB?style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/badge/Deploy-GitHub%20Pages%20via%20Actions-2088FF?style=for-the-badge&logo=githubactions"/>
</p>

---

## 🎯 Propósito do Projeto

O **DataSocial** foi desenvolvido para transformar a gestão do Terceiro Setor e potencializar o impacto social no Brasil. A plataforma conecta Organizações da Sociedade Civil (OSCs/ONGs), investidores corporativos, conselhos de direito e pareceristas jurídicos e contábeis em um ecossistema transparente e estruturado.

> **Foco Operacional:** Diagnóstico MROSC (Lei 13.019/14), governança institucional, compliance para fundos de incentivo e alocação orientada por dados de investimento social privado (ISP).

---

## 🏛️ Módulos e Funcionalidades

### 1. Avaliação de Maturidade e Diagnóstico MROSC
Matriz de avaliação automatizada que analisa a saúde institucional das ONGs em 5 pilares estratégicos:

| Pilar | Descrição & Indicadores |
|-------|------------------------|
| **Governança & MROSC** | Conformidade com Lei 13.019/14, estatuto social, atas registradas e diretoria ativa |
| **Capacidade de Captação** | Cadastro nas leis de incentivo (FIA, Idoso, Rouanet, Esporte, PRONAS/PRONON) |
| **Transparência Contábil** | Prestação de contas, auditoria, balanço patrimonial e certidões negativas |
| **Gestão Financeira & Riscos** | Controle orçamentário, segregação de contas e sustentabilidade financeira |
| **Impacto & Metas (ODS)** | Mapeamento de beneficiários e alinhamento com Objetivos de Desenvolvimento Sustentável |

---

### 2. Gestão de Projetos e Captação de Recursos

Mapeamento completo dos projetos cadastrados por leis de incentivo:

- **FIA (Fundo da Infância e do Adolescente)** — Projetos focados em direitos da criança e adolescente
- **Fundo do Idoso** — Ações de amparo e dignidade para a pessoa idosa
- **Lei Rouanet / Cultura** — Projetos culturais com aprovação na Secretaria Nacional de Cultura
- **Lei de Incentivo ao Esporte** — Ações esportivas educacionais, de rendimento e participação
- **Recursos Próprios / Diretos** — Doações diretas e patrocínios institucionais

---

### 3. Painéis de Controle por Perfil de Usuário

Plataforma multi-perfil adaptada para cada ator do ecossistema social:

| Perfil | Recursos do Dashboard |
|--------|-----------------------|
| 🏢 **Investidor / Empresa** | Matching de projetos por ODS e região, calculadora de renúncia fiscal e ROI social |
| 🛡️ **Advogado / Jurídico** | Verificação de conformidade MROSC, certidões e histórico de atas/estatutos |
| 📊 **Contador / Financeiro** | Análise de balanços, DRE, segregação de contas bancárias e regularidade fiscal |
| 🏛️ **Fundação / Conselho** | Deliberação de fundos, acompanhamento de execuções físicas e financeiras |
| 👑 **Administrador** | Gestão de permissões, logs de sistema e parâmetros globais da plataforma |

---

## 📊 Integração com Google Sheets (Tempo Real)

Toda a inteligência de dados do **DataSocial** possui sincronização bidirecional em tempo real com o **Google Sheets**, funcionando como banco de dados estruturado e transparente.

- **ID da Planilha Oficial:** `1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE`
- **Link Direto:** 🔗 [Abrir Planilha de Governança no Google Sheets](https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit)

### Abas da Planilha Sincronizada

```
DataSocial Google Sheet Database
├── ONGs Cadastradas          → Dados cadastrais, CNPJ, responsável, pontuação e nível MROSC
├── Projetos e Captação       → Projetos cadastrados, lei de incentivo, valor aprovado e captado
├── Investidores e Patrocinadores → Empresas, teto de renúncia fiscal, ODS prioritários e aportes
└── Resumo Governança         → Métricas consolidadas, total captado e distribuição geográfica
```

> A documentação técnica detalhada das colunas e tipos de dados está no arquivo [`INTEGRACAO_GOOGLE_SHEETS.md`](./INTEGRACAO_GOOGLE_SHEETS.md).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js**: `v18+` ou `v20+`
- **npm** ou **bun**

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/wesleyzilva/https-github.com-wesleyzilva-DataSocial.git

# 2. Entrar na pasta do projeto
cd https-github.com-wesleyzilva-DataSocial

# 3. Instalar as dependências
npm install

# 4. Executar em ambiente de desenvolvimento
npm run dev
```

Acesse no seu navegador: **`http://localhost:3000`**

---

## 🌐 Deploy Automático no GitHub Pages

O projeto conta com um pipeline de CI/CD automatizado via **GitHub Actions** (`.github/workflows/deploy.yml`). A cada novo commit ou exportação para a branch `main`, a build estática do React é gerada e publicada automaticamente.

- **URL de Produção:** 👉 **[https://wesleyzilva.github.io/https-github.com-wesleyzilva-DataSocial/](https://wesleyzilva.github.io/https-github.com-wesleyzilva-DataSocial/)**

---

## 🛠️ Tecnologias & Arquitetura

```
DataSocial Stack
├── UI / Frontend   → React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
├── Autenticação    → Google Workspace OAuth 2.0 (GSI Client), Firebase Auth
├── Backend / Server → Express.js (proxy de APIs e rotas de integração)
├── Servidor Dev    → Vite + tsx (Porta 3000)
└── CI/CD          → GitHub Actions + gh-pages
```

---

## 📝 Licença & Uso

Este repositório é parte da iniciativa **DataSocial** para fortalecimento da transparência e governança no Terceiro Setor.

---

<p align="center">
  <b>DataSocial</b> · Transformando Governança em Impacto Social
</p>
