# 📊 Guia Completo da Integração Google Sheets & Dicionário de Dados Analíticos (Data SocIAl)

Este documento descreve detalhadamente a arquitetura de integração com o **Google Sheets**, o **Dicionário de Dados** para uso analítico/pesquisa e o passo a passo para simulações com **ONGs**, **Projetos** e **Investidores Sociais**.

---

## 🚀 1. Visão Geral da Arquitetura

A plataforma **Data SocIAl** utiliza o **Google Sheets** como um **Banco de Dados Analítico e de Business Intelligence (BI)** em tempo real. Cada ação realizada na aplicação (cadastros de ONGs, lançamentos de projetos, aporte de investidores ou atualização de notas de conformidade MROSC) é persistida e sincronizada automaticamente no Sheets oficial.

- **ID da Planilha Oficial**: `1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE`
- **Link de Acesso Direto**: [Abrir Planilha Oficial no Google Sheets](https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit?gid=0#gid=0)
- **Método de Conexão**: Google Workspace OAuth 2.0 Client (`initTokenClient` / Firebase Auth Popup) + REST Endpoints Express (`/api/sheets/sync` e `/api/sheets/read`).

---

## 🔐 2. Autenticação & Permissões (OAuth 2.0)

A integração funciona com duplo fluxo seguro:
1. **OAuth 2.0 em Modalidade Popup (Client-Side)**: O usuário autoriza sua conta Google clicando no botão `🔑 Conectar Google & Sincronizar`. O token obtido concede os escopos:
   - `https://www.googleapis.com/auth/spreadsheets` (Acesso de leitura/escrita em planilhas)
   - `https://www.googleapis.com/auth/drive` (Acesso a arquivos e pastas do Google Drive)
2. **Servidor Express Proxy (`server.ts`)**: O servidor recebe os dados enriquecidos e utiliza o `google.auth.OAuth2` da biblioteca oficial `googleapis` para realizar a gravação estruturada com a opção `USER_ENTERED` (preservando formatos e fórmulas nativas do Sheets).

---

## 📖 3. Dicionário de Dados Analíticos (Data Dictionary)

A planilha é composta por **4 abas estruturadas** no Google Sheets. Abaixo está a especificação completa de cada campo para estudos econômicos, indicadores MROSC e modelagem estatística.

### 🏛️ Aba 1: `ONGs Cadastradas`
| Nome da Coluna | Tipo de Dado | Descrição & Finalidade Analítica | Exemplo |
| :--- | :--- | :--- | :--- |
| `ID` | `Texto` | Chave primária única da Organização da Sociedade Civil (OSC). | `ong-1` |
| `Nome da ONG` | `Texto` | Razão social oficial registrada no CNPJ. | `Associação Instituto Vida Viva` |
| `CNPJ` | `Texto` | Cadastro Nacional da Pessoa Jurídica (14 dígitos). | `12.345.678/0001-90` |
| `Área de Atuação` | `Texto` | Setor primário conforme diretrizes do MROSC. | `Educação e Pesquisa` |
| `Cidade` | `Texto` | Município da sede principal da ONG. | `São Paulo` |
| `UF` | `Texto (2)` | Estado da sede principal (Sigla). | `SP` |
| `Selo de Maturidade` | `Texto` | Nível de maturidade jurídica (`Bronze`, `Prata`, `Ouro`). | `Ouro` |
| `Score Governança (%)` | `Número (0-100)`| Porcentagem de conformidade estatutária e fiscal. | `92` |
| `Beneficiários Ativos` | `Número Inteiro`| População total atendida diretamente no ano. | `1200` |
| `Captação Total (R$)` | `Moeda (R$)` | Volume de recursos captados via leis e doações. | `R$ 450.000,00` |

---

### 🚀 Aba 2: `Projetos e Captação`
| Nome da Coluna | Tipo de Dado | Descrição & Finalidade Analítica | Exemplo |
| :--- | :--- | :--- | :--- |
| `ID` | `Texto` | Código identificador do projeto social. | `proj-101` |
| `Título do Projeto` | `Texto` | Nome público do projeto de captação. | `Projeto Futuro Jovem` |
| `ONG Responsável` | `Texto` | Nome da ONG executora vinculada. | `Associação Instituto Vida Viva` |
| `Mecanismo Fiscal` | `Texto` | Mecanismo legal (`FIA`, `Lei Rouanet`, `Lei do Esporte`, `PIX`). | `FIA` |
| `Meta (R$)` | `Moeda (R$)` | Orçamento total aprovado para execução. | `R$ 200.000,00` |
| `Captado (R$)` | `Moeda (R$)` | Valor efetivamente aportado até o momento. | `R$ 135.000,00` |
| `Status` | `Texto` | Fase do ciclo de vida (`Em Captação`, `Em Execução`, `Concluído`). | `Em Captação` |
| `Beneficiários Impactados`| `Número Inteiro`| Meta quantitativa de inscritos/participantes. | `350` |

---

### 💼 Aba 3: `Investidores e Patrocinadores`
| Nome da Coluna | Tipo de Dado | Descrição & Finalidade Analítica | Exemplo |
| :--- | :--- | :--- | :--- |
| `ID` | `Texto` | Código identificador da empresa/patrocinador. | `inv-1` |
| `Empresa / Investidor Social` | `Texto` | Razão Social da empresa investidora. | `Itaú Social / Instituto Itaú` |
| `CNPJ` | `Texto` | Registro fiscal da empresa investidora. | `60.701.190/0001-04` |
| `Orçamento Dedutível (R$)` | `Moeda (R$)` | Teto anual de dedução fiscal (Lucro Real 6% IRPJ). | `R$ 5.000.000,00` |
| `Áreas de Interesse` | `Texto (CSV)` | Temáticas priorizadas para investimento social. | `Educação, Cultura` |
| `Leis Preferenciais` | `Texto (CSV)` | Leis de incentivo com abatimento fiscal almejado. | `FIA, Lei Rouanet` |
| `Pessoa de Contato` | `Texto` | Nome e cargo do executivo de ESG / Investimento. | `Ana Paula Castro` |
| `E-mail` | `E-mail` | Endereço oficial de comunicação corporativa. | `itau.social@itau.com.br` |

---

### 📊 Aba 4: `Resumo Governança`
| Nome da Coluna | Tipo de Dado | Descrição & Finalidade Analítica |
| :--- | :--- | :--- |
| `Indicador MROSC` | `Texto` | Métrica agregada (ex: Total de ONGs, Selos Ouro, Volume de Captação). |
| `Valor Atual` | `Misto` | Contagem numérica ou soma financeira consolidada. |
| `Observação de Governança` | `Texto` | Comentário explicativo sobre a conformidade regulatória. |

---

## 🧪 4. Roteiro de Simulação Passo a Passo

Para simular o fluxo completo de uma **ONG** e de um **Investidor Social** gerando dados analíticos no Google Sheets:

### 🔹 Passo 1: Cadastrar uma Nova ONG
1. No menu superior, navegue até **`➕ Cadastrar ONG`**.
2. Preencha os campos (Nome, CNPJ, Área de Atuação, Cidade, Estado, Beneficiários).
3. Clique em **`Concluir Cadastro & Diagnosticar`**.
4. A ONG receberá a pontuação inicial de maturidade e os dados serão salvos na aba **`ONGs Cadastradas`** da planilha.

### 🔹 Passo 2: Cadastrar um Projeto de Captação
1. Acesse o **Selo de Maturidade** da ONG e clique em **`Ir para Projetos & Captação`**.
2. Clique no botão **`Cadastrar Novo Projeto`**.
3. Escolha o mecanismo fiscal (ex: **FIA** ou **Lei Rouanet**), insira a meta (ex: `R$ 150.000,00`) e descreva os itens orçamentários.
4. Clique em **`Salvar Projeto`**. O projeto irá para a aba **`Projetos e Captação`** no Google Sheets.

### 🔹 Passo 3: Cadastrar e Simular um Investidor Social
1. No menu do topo, clique no perfil **`Investidor Social`** ou vá para **`💼 Cadastrar Investidor`**.
2. Preencha o CNPJ, Regime Tributário (**Lucro Real**), Orçamento Dedutível (ex: `R$ 2.000.000,00`) e Leis de Interesse.
3. Clique em **`Cadastrar Investidor`**. Ele será listado na aba **`Investidores e Patrocinadores`** do Sheets.
4. Simule um aporte financeiro clicando em **`Aportar / Doar`** no projeto da ONG. O valor captado e a barra de progresso no Sheets serão atualizados em tempo real!

---

## 🛠️ 5. Console de Logs e Diagnóstico
Em caso de divergências ou para acompanhar as requisições em tempo real:
- Clique no botão **`Logs`** no topo da tela ou no rodapé para abrir o **Console de Diagnóstico de Sistema**.
- O console exibirá todas as trocas de mensagens entre o aplicativo, o Firebase Auth e a API do Google Sheets.
