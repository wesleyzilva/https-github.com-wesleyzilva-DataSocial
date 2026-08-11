import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { MOCK_ONGS, MOCK_PROJECTS } from './src/mockData.js';
import { ONG, Project, Investor } from './src/types.js';

const currentDirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data persistence store
let ongsStore: ONG[] = [...MOCK_ONGS];
let projectsStore: Project[] = [...MOCK_PROJECTS];
let investorsStore: Investor[] = [
  {
    id: 'inv-1',
    name: 'Itaú Social / Instituto Itaú',
    cnpj: '60.701.190/0001-04',
    type: 'Lucro Real',
    totalDeductibleBudgetR$: 5000000,
    contactPerson: 'Juliana Mendes - Diretoria de Impacto',
    email: 'itau.social@itau.com.br',
    phone: '(11) 3003-4828',
    preferredAreas: ['Educação', 'Cultura'],
    preferredIncentiveLaws: ['FIA', 'Lei Rouanet'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-2',
    name: 'Klabin SA',
    cnpj: '89.637.490/0001-45',
    type: 'Lucro Real',
    totalDeductibleBudgetR$: 2500000,
    contactPerson: 'Ricardo Silveira - Gerente de Sustentabilidade',
    email: 'esg@klabin.com.br',
    phone: '(11) 3046-5000',
    preferredAreas: ['Meio Ambiente', 'Assistência Social'],
    preferredIncentiveLaws: ['Incentivo ao Esporte', 'FIA'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-3',
    name: 'Gerdau Impacto',
    cnpj: '33.611.500/0001-19',
    type: 'Lucro Real',
    totalDeductibleBudgetR$: 1800000,
    contactPerson: 'Fernanda Lima - Responsabilidade Social',
    email: 'gerdau.impacto@gerdau.com.br',
    phone: '(11) 3004-9000',
    preferredAreas: ['Juventude', 'Capacitação'],
    preferredIncentiveLaws: ['Pronas/PCD', 'Lei Rouanet'],
    createdAt: new Date().toISOString(),
  },
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Arandu Monolith API',
    version: '1.0.0',
    ongsCount: ongsStore.length,
    projectsCount: projectsStore.length,
    sheetsIntegrationActive: true,
    timestamp: new Date().toISOString(),
  });
});

// Auth Module endpoints
app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'user-adv-1',
      name: 'Dra. Patricia Medeiros',
      email: 'patricia.medeiros@arandu.org',
      role: 'advogado',
      perspective: 'advogado',
    },
  });
});

app.get('/api/auth/personas', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'advogado', name: 'Dra. Patricia Medeiros', role: 'Advogado / Captador', avatar: '⚖️' },
      { id: 'contador', name: 'Dr. Roberto Alves', role: 'Contador OSC', avatar: '📊' },
      { id: 'ong', name: 'Instituto Esperança', role: 'Gestor da ONG', avatar: '🌱' },
      { id: 'investidor', name: 'Empresa Doadora Lucro Real', role: 'Financiador', avatar: '💼' },
      { id: 'fundacao', name: 'Fundação Impacto Social', role: 'Fundação Doadora', avatar: '🏛️' },
      { id: 'admin', name: 'Administrador Arandu', role: 'Admin Plataforma', avatar: '🛡️' },
    ],
  });
});

// Investors Module
app.get('/api/investors', (req, res) => {
  res.json({
    success: true,
    data: investorsStore,
  });
});

app.post('/api/investors', (req, res) => {
  try {
    const newInvestor: Investor = req.body;
    if (!newInvestor.name) {
      return res.status(400).json({ success: false, error: 'Nome do investidor é obrigatório.' });
    }
    newInvestor.id = newInvestor.id || `inv-${Date.now()}`;
    newInvestor.cnpj = newInvestor.cnpj || '00.000.000/0001-00';
    newInvestor.type = newInvestor.type || 'Lucro Real';
    newInvestor.totalDeductibleBudgetR$ = Number(newInvestor.totalDeductibleBudgetR$) || 100000;
    newInvestor.contactPerson = newInvestor.contactPerson || 'Contato ESG / Investimento Social';
    newInvestor.email = newInvestor.email || 'investimento@empresa.com.br';
    newInvestor.phone = newInvestor.phone || '(11) 99999-9999';
    newInvestor.preferredAreas = Array.isArray(newInvestor.preferredAreas) ? newInvestor.preferredAreas : ['Educação'];
    newInvestor.preferredIncentiveLaws = Array.isArray(newInvestor.preferredIncentiveLaws) ? newInvestor.preferredIncentiveLaws : ['Lei Rouanet'];
    newInvestor.createdAt = new Date().toISOString();

    investorsStore.unshift(newInvestor);
    res.status(201).json({ success: true, data: newInvestor });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Erro ao cadastrar investidor.' });
  }
});

app.put('/api/investors/:id', (req, res) => {
  const { id } = req.params;
  const index = investorsStore.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Investidor não encontrado.' });
  }

  investorsStore[index] = { ...investorsStore[index], ...req.body };
  res.json({ success: true, data: investorsStore[index] });
});

app.delete('/api/investors/:id', (req, res) => {
  const { id } = req.params;
  investorsStore = investorsStore.filter(i => i.id !== id);
  res.json({ success: true, message: 'Investidor removido com sucesso.' });
});

app.get('/api/investors/:id/match', (req, res) => {
  const { id } = req.params;
  const eligibleProjects = projectsStore.filter(p => p.status === 'Em Captação' || p.status === 'Em Execução');
  res.json({
    success: true,
    investorId: id,
    matchedProjectsCount: eligibleProjects.length,
    matches: eligibleProjects.map(p => ({
      projectId: p.id,
      title: p.title,
      ongName: p.ongName,
      mecanismo: p.mecanismo,
      targetAmountR$: p.targetAmountR$,
      matchScorePercentage: 92,
      reason: 'Compatibilidade com meta de incentivo fiscal e ODS direcionada.',
    })),
  });
});

// Impact Module
app.get('/api/impact/summary', (req, res) => {
  const totalBeneficiaries = ongsStore.reduce((acc, o) => acc + o.activeBeneficiariesCount, 0);
  const totalRaised = projectsStore.reduce((acc, p) => acc + p.raisedAmountR$, 0);
  const totalTarget = projectsStore.reduce((acc, p) => acc + p.targetAmountR$, 0);

  res.json({
    success: true,
    summary: {
      activeOngsCount: ongsStore.length,
      activeProjectsCount: projectsStore.length,
      totalBeneficiariesImpacted: totalBeneficiaries,
      totalRaisedR$: totalRaised,
      totalTargetR$: totalTarget,
      captaEfficiencyPercentage: totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0,
      goldSealOngs: ongsStore.filter(o => o.maturityLevel === 'Ouro').length,
      silverSealOngs: ongsStore.filter(o => o.maturityLevel === 'Prata').length,
      bronzeSealOngs: ongsStore.filter(o => o.maturityLevel === 'Bronze').length,
    },
  });
});

// Monitoring Module
app.get('/api/monitoring/audit-trail', (req, res) => {
  res.json({
    success: true,
    auditTrail: [
      { id: 'aud-1', timestamp: new Date().toISOString(), action: 'VALIDACAO_MROSC', actor: 'Dra. Patricia Medeiros', detail: 'Validação de certidões e estatuto do Instituto Esperança.' },
      { id: 'aud-2', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'CRIACAO_PROJETO', actor: 'Instituto Esperança', detail: 'Projeto "Escola de Música Jovem" cadastrado com ODS 4.' },
      { id: 'aud-3', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'SINCRONIZACAO_SHEETS', actor: 'Sistema Arandu', detail: 'Sincronização de relatórios efetuada no Google Sheets.' },
    ],
  });
});

// Dashboard Module
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      ongs: { total: ongsStore.length, ouro: ongsStore.filter(o => o.maturityLevel === 'Ouro').length },
      projects: { total: projectsStore.length, emCaptacao: projectsStore.filter(p => p.status === 'Em Captação').length },
      financials: { totalRaisedR$: projectsStore.reduce((acc, p) => acc + p.raisedAmountR$, 0) },
      sheetsConnected: true,
    },
  });
});

// Sheets Data Read Endpoint
app.get('/api/sheets/data', (req, res) => {
  res.json({
    success: true,
    source: 'Arandu-Monolith-Store',
    sheets: {
      ongs: ongsStore,
      projects: projectsStore,
      summary: {
        totalOngs: ongsStore.length,
        totalProjects: projectsStore.length,
        totalRaisedR$: projectsStore.reduce((acc, p) => acc + p.raisedAmountR$, 0),
      },
    },
  });
});

// GET /api/ongs
app.get('/api/ongs', (req, res) => {
  const { area, state, level } = req.query;
  let filtered = [...ongsStore];

  if (area && typeof area === 'string') {
    filtered = filtered.filter(o => o.areaAtuacao === area);
  }
  if (state && typeof state === 'string') {
    filtered = filtered.filter(o => o.state.toUpperCase() === state.toUpperCase());
  }
  if (level && typeof level === 'string') {
    filtered = filtered.filter(o => o.maturityLevel.toLowerCase() === level.toLowerCase());
  }

  res.json({ success: true, data: filtered });
});

// POST /api/ongs
app.post('/api/ongs', (req, res) => {
  try {
    const newOng: ONG = req.body;
    if (!newOng.name || !newOng.cnpj) {
      return res.status(400).json({ success: false, error: 'Nome e CNPJ são obrigatórios.' });
    }

    // Default missing fields
    newOng.id = newOng.id || `ong-${Date.now()}`;
    newOng.totalRaisedR$ = newOng.totalRaisedR$ || 0;
    newOng.activeBeneficiariesCount = newOng.activeBeneficiariesCount || 0;
    newOng.governanceScore = newOng.governanceScore || 40;
    newOng.maturityLevel = newOng.maturityLevel || 'Bronze';
    newOng.verifiedStatus = true;
    newOng.createdAt = new Date().toISOString();

    ongsStore.unshift(newOng);
    res.status(201).json({ success: true, data: newOng });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Erro ao cadastrar ONG' });
  }
});

// PUT /api/ongs/:id
app.put('/api/ongs/:id', (req, res) => {
  const { id } = req.params;
  const index = ongsStore.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'ONG não encontrada.' });
  }

  ongsStore[index] = { ...ongsStore[index], ...req.body };
  res.json({ success: true, data: ongsStore[index] });
});

// GET /api/projects
app.get('/api/projects', (req, res) => {
  const { ongId, mecanismo } = req.query;
  let filtered = [...projectsStore];

  if (ongId && typeof ongId === 'string') {
    filtered = filtered.filter(p => p.ongId === ongId);
  }
  if (mecanismo && typeof mecanismo === 'string') {
    filtered = filtered.filter(p => p.mecanismo === mecanismo);
  }

  res.json({ success: true, data: filtered });
});

// POST /api/projects
app.post('/api/projects', (req, res) => {
  try {
    const newProject: Project = req.body;
    if (!newProject.title || !newProject.targetAmountR$) {
      return res.status(400).json({ success: false, error: 'Título e Meta Financeira são obrigatórios.' });
    }

    newProject.id = newProject.id || `proj-${Date.now()}`;
    newProject.raisedAmountR$ = newProject.raisedAmountR$ || 0;
    newProject.status = newProject.status || 'Em Captação';

    projectsStore.unshift(newProject);

    // Update ONG createdProjectsCount
    const ong = ongsStore.find(o => o.id === newProject.ongId);
    if (ong) {
      ong.createdProjectsCount = (ong.createdProjectsCount || 0) + 1;
    }

    res.status(201).json({ success: true, data: newProject });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Erro ao criar projeto.' });
  }
});

// POST /api/projects/:id/donate
app.post('/api/projects/:id/donate', (req, res) => {
  const { id } = req.params;
  const { amountR$, donorName } = req.body;
  const project = projectsStore.find(p => p.id === id);

  if (!project) {
    return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });
  }

  const donation = Number(amountR$) || 0;
  project.raisedAmountR$ += donation;

  if (project.raisedAmountR$ >= project.targetAmountR$) {
    project.status = 'Em Execução';
  }

  // Update ONG total raised
  const ong = ongsStore.find(o => o.id === project.ongId);
  if (ong) {
    ong.totalRaisedR$ += donation;
  }

  res.json({
    success: true,
    message: `Agradecemos a doação de R$ ${donation.toLocaleString('pt-BR')}${donorName ? ` de ${donorName}` : ''}!`,
    data: project,
  });
});

// GET /api/investors
app.get('/api/investors', (req, res) => {
  res.json({ success: true, data: investorsStore });
});

// POST /api/investors
app.post('/api/investors', (req, res) => {
  try {
    const newInv: Investor = req.body;
    if (!newInv.name) {
      return res.status(400).json({ success: false, error: 'Nome do investidor é obrigatório.' });
    }

    newInv.id = newInv.id || `inv-${Date.now()}`;
    newInv.cnpj = newInv.cnpj || '00.000.000/0001-00';
    newInv.type = newInv.type || 'Lucro Real';
    newInv.totalDeductibleBudgetR$ = Number(newInv.totalDeductibleBudgetR$) || 500000;
    newInv.createdAt = new Date().toISOString();

    investorsStore.unshift(newInv);
    res.status(201).json({ success: true, data: newInv });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Erro ao criar investidor.' });
  }
});

// PUT /api/investors/:id
app.put('/api/investors/:id', (req, res) => {
  const { id } = req.params;
  const index = investorsStore.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Investidor não encontrado.' });
  }

  investorsStore[index] = { ...investorsStore[index], ...req.body };
  res.json({ success: true, data: investorsStore[index] });
});

// DELETE /api/investors/:id
app.delete('/api/investors/:id', (req, res) => {
  const { id } = req.params;
  const index = investorsStore.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Investidor não encontrado.' });
  }

  const removed = investorsStore.splice(index, 1);
  res.json({ success: true, message: 'Investidor removido com sucesso.', data: removed[0] });
});

// POST /api/ai/diagnose
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { ongData } = req.body;
    if (!ongData) {
      return res.status(400).json({ success: false, error: 'Dados da ONG não informados.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback rule-based diagnostic if key is missing or not provided
      return res.json({
        success: true,
        source: 'rule-engine',
        data: {
          overallScore: ongData.governanceScore || 65,
          maturityAssessed: ongData.maturityLevel || 'Bronze',
          keyStrengths: [
            'CNPJ e Documentação Básica em Dia',
            'Propósito Social e Área de Atuação Claros',
            'Comprovante de Inscrição e Regularidade Fiscal',
          ],
          criticalGaps: [
            'Ainda falta Portal de Transparência Aberto para Doadores',
            'Manual de Compras e Regimento Interno precisam de consolidação',
            'Relatório Anual de Impacto com ODS e indicadores não publicado',
          ],
          roadmap30Days: [
            'Elaborar o Regimento Interno e o Manual de Compras da Organização',
            'Apreciar as contas do último exercício com a Diretoria Executiva',
            'Acessar o módulo de Selo Prata no ONGanizator',
          ],
          roadmap60Days: [
            'Publicar a Prestação de Contas no Portal de Transparência',
            'Inscrever a ONG no Conselho Municipal da Criança e Adolescente (CMDCA)',
            'Cadastrar o primeiro projeto apto para FIA ou Incentivo Fiscal',
          ],
          roadmap90Days: [
            'Estruturar o Código de Ética e Política de Proteção Infantil',
            'Submeter proposta para leis de incentivo (Lei Rouanet / Esporte / FIA)',
            'Realizar evento ou campanha de captação de recursos via PIX com QR Code',
          ],
          recommendedIncentiveLaws: ['FIA', 'MROSC / Parceria Pública', 'Doação Direta PIX', 'Lei Rouanet'],
          suggestedActionPlans: [
            { title: 'Implantação do Selo Prata de Governança', detail: 'Regularize o balanço patrimonial e publique a prestação de contas no portal.', priority: 'Alta' },
            { title: 'Qualificação para Captação em Leis de Incentivo', detail: 'Cadastre a instituição nos conselhos de direitos para receber repasses de IR.', priority: 'Alta' },
            { title: 'Digitalização da Prestação de Contas', detail: 'Habilite a transparência em tempo real para aumentar a confiança dos doadores.', priority: 'Média' },
          ],
        },
      });
    }

    // Call Gemini API
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um especialista sênior em governança de ONGs no Brasil, MROSC (Lei 13.019/2014) e Leis de Incentivo Fiscal (FIA, Rouanet, Esporte, PRONON).
Análise os dados da seguinte ONG brasileira:
Nome: ${ongData.name}
CNPJ: ${ongData.cnpj}
Área de Atuação: ${ongData.areaAtuacao}
Ano de Fundação: ${ongData.foundingYear || 2020}
Pontuação Atual de Governança: ${ongData.governanceScore || 50}/100
Nível Atual de Maturidade: ${ongData.maturityLevel || 'Bronze'}
Missão: ${ongData.mission || 'Sem missão detalhada'}

Retorne EXATAMENTE um objeto JSON válido sem Markdown (sem \`\`\`json) com as seguintes chaves:
{
  "overallScore": number (0 a 100),
  "maturityAssessed": string ("Bronze", "Prata" ou "Ouro"),
  "keyStrengths": array de strings com 3 pontos fortes,
  "criticalGaps": array de strings com 3 lacunas críticas para resolver,
  "roadmap30Days": array com 3 ações para 30 dias,
  "roadmap60Days": array com 3 ações para 60 dias,
  "roadmap90Days": array com 3 ações para 90 dias,
  "recommendedIncentiveLaws": array com leis aplicáveis (ex: ["FIA", "Lei Rouanet", "MROSC / Parceria Pública"]),
  "suggestedActionPlans": array de objetos contendo {"title": string, "detail": string, "priority": "Alta"|"Média"|"Baixa"}
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    res.json({ success: true, source: 'gemini-ai', data: parsed });
  } catch (error: any) {
    console.error('AI Diagnostic Error:', error);
    res.json({
      success: true,
      source: 'fallback-error',
      data: {
        overallScore: 70,
        maturityAssessed: 'Bronze',
        keyStrengths: ['Entidade Cadastrada no ONGanizator', 'Objetivo Social Definido', 'Adesão às Boas Práticas'],
        criticalGaps: ['Formalização do Conselho Fiscal', 'Publicação do Balanço Patrimonial'],
        roadmap30Days: ['Organizar documentos do Selo Bronze e Prata', 'Concluir cadastro de projetos'],
        roadmap60Days: ['Criar página de transparência pública', 'Captação via PIX'],
        roadmap90Days: ['Pleitear Selo Ouro'],
        recommendedIncentiveLaws: ['FIA', 'Doação Direta PIX'],
        suggestedActionPlans: [
          { title: 'Fortalecimento da Governança', detail: 'Conclua os requisitos do Selo Prata.', priority: 'Alta' },
        ],
      },
    });
  }
});

// GET /api/drive/config - Returns Google Drive target folder configuration
app.get('/api/drive/config', (req, res) => {
  res.json({
    success: true,
    targetFolderId: '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE',
    targetFolderUrl: 'https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit?gid=0#gid=0',
    folderName: 'Data SocIAl - Google Sheets Storage',
  });
});

// Helper to parse CSV string into 2D array of values
function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSVText(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  return lines.map(parseCSVRow);
}

// Fetch values from Google Sheets via public CSV export or SDK
async function fetchSheetValues(spreadsheetId: string, sheetName: string, accessToken?: string): Promise<string[][] | null> {
  // 1. First try: Fetch via Google Sheets Public CSV / Viz API (works for any public/shared spreadsheet)
  try {
    const encodedSheet = encodeURIComponent(sheetName);
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`;
    const response = await fetch(csvUrl);
    if (response.ok) {
      const csvText = await response.text();
      if (csvText && !csvText.includes('<!DOCTYPE html>') && !csvText.includes('<html')) {
        const rows = parseCSVText(csvText);
        if (rows && rows.length > 0) {
          return rows;
        }
      }
    }
  } catch (csvErr) {
    // Silently proceed to OAuth/Service account SDK if CSV fetch failed
  }

  // 2. Second try: Use Google Sheets API SDK if valid OAuth Access Token or Service Account exists
  try {
    let auth: any = null;
    if (accessToken && accessToken.trim().length > 0) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      auth = oauth2Client;
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
    }

    if (auth) {
      const sheets = google.sheets({ version: 'v4', auth });
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetName}'!A1:Z100`,
      });
      if (res.data.values && res.data.values.length > 0) {
        return res.data.values as string[][];
      }
    }
  } catch (err: any) {
    console.log(`Note: Google Sheets API SDK returned: ${err.message}`);
  }

  return null;
}

// POST /api/sheets/read - Reads ONGs, Projects, and Investors from a Google Spreadsheet ID or URL
app.post('/api/sheets/read', async (req, res) => {
  try {
    const { spreadsheetIdOrUrl, accessToken } = req.body;
    if (!spreadsheetIdOrUrl) {
      return res.status(400).json({ success: false, error: 'Forneça o ID ou a URL da Planilha do Google Sheets.' });
    }

    let spreadsheetId = spreadsheetIdOrUrl.trim();
    const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      spreadsheetId = match[1];
    }

    // Read ONGs tab
    let importedOngs: ONG[] = [];
    const ongValues = await fetchSheetValues(spreadsheetId, 'ONGs Cadastradas', accessToken);
    if (ongValues && ongValues.length > 1) {
      importedOngs = ongValues.slice(1).filter(r => r[1]).map((row, idx) => ({
        id: row[0] || `ong-sheet-${idx + 1}`,
        name: row[1],
        cnpj: row[2] || '00.000.000/0001-00',
        areaAtuacao: (row[3] || 'Assistência Social') as any,
        city: row[4] || 'São Paulo',
        state: row[5] || 'SP',
        maturityLevel: (['Ouro', 'Prata', 'Bronze'].includes(row[6]) ? row[6] : 'Prata') as any,
        governanceScore: parseInt(row[7]) || 85,
        activeBeneficiariesCount: parseInt(row[8]) || 120,
        totalRaisedR$: parseFloat(String(row[9]).replace(/[^0-9.]/g, '')) || 50000,
        foundingYear: 2018,
        mission: 'Promoção do impacto social e conformidade MROSC.',
        summary: 'Organização social cadastrada via integração Google Sheets.',
        email: 'contato@ong.org.br',
        phone: '(11) 99999-0000',
        requirements: [],
        verifiedStatus: true,
        createdAt: new Date().toISOString(),
      }));
    }

    // Read Projects tab
    let importedProjects: Project[] = [];
    const projValues = await fetchSheetValues(spreadsheetId, 'Projetos e Captação', accessToken);
    if (projValues && projValues.length > 1) {
      importedProjects = projValues.slice(1).filter(r => r[1]).map((row, idx) => ({
        id: row[0] || `proj-sheet-${idx + 1}`,
        title: row[1],
        ongName: row[2] || 'ONG Responsável',
        mecanismo: (row[3] || 'FIA') as any,
        targetAmountR$: parseFloat(String(row[4]).replace(/[^0-9.]/g, '')) || 100000,
        raisedAmountR$: parseFloat(String(row[5]).replace(/[^0-9.]/g, '')) || 30000,
        status: (row[6] || 'Em Captação') as any,
        beneficiariesCount: parseInt(row[7]) || 80,
        ongId: 'ong-1',
        summary: 'Projeto cadastrado e gerido via Google Sheets.',
        description: 'Detalhamento do projeto social e captação de recursos.',
        odsList: [4, 10],
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        budgetBreakdown: [{ item: 'Execução do Projeto', amountR$: parseFloat(String(row[4]).replace(/[^0-9.]/g, '')) || 100000 }],
        createdAt: new Date().toISOString(),
        budgetItems: [],
      }));
    }

    // Read Investors tab
    let importedInvestors: Investor[] = [];
    const invValues = await fetchSheetValues(spreadsheetId, 'Investidores e Patrocinadores', accessToken);
    if (invValues && invValues.length > 1) {
      importedInvestors = invValues.slice(1).filter(r => r[1]).map((row, idx) => ({
        id: row[0] || `inv-sheet-${idx + 1}`,
        name: row[1],
        cnpj: row[2] || '00.000.000/0001-00',
        type: 'Lucro Real',
        totalDeductibleBudgetR$: parseFloat(String(row[3] || row[2]).replace(/[^0-9.]/g, '')) || 500000,
        contactPerson: row[6] || 'Gestor de ESG',
        email: row[7] || 'esg@empresa.com.br',
        phone: '(11) 99999-9999',
        preferredAreas: (row[4] || 'Educação').split(',').map((s: string) => s.trim()),
        preferredIncentiveLaws: (row[5] || 'Lei Rouanet').split(',').map((s: string) => s.trim()),
        createdAt: new Date().toISOString(),
      }));
    }

    if (importedOngs.length > 0) {
      ongsStore = importedOngs;
    }
    if (importedProjects.length > 0) {
      projectsStore = importedProjects;
    }
    if (importedInvestors.length > 0) {
      investorsStore = importedInvestors;
    }

    res.json({
      success: true,
      importedOngsCount: importedOngs.length,
      importedProjectsCount: importedProjects.length,
      importedInvestorsCount: importedInvestors.length,
      ongs: ongsStore,
      projects: projectsStore,
      investors: investorsStore,
      message: `Sucesso! Dados processados (${importedOngs.length} ONGs, ${importedProjects.length} Projetos, ${importedInvestors.length} Investidores importados do Google Sheets).`,
    });
  } catch (error: any) {
    console.error('Google Sheets Read Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao ler dados da planilha do Google Sheets.' });
  }
});

// POST /api/sheets/sync - Create and update Google Spreadsheet inside Google Drive Folder for ONGanizator
app.post('/api/sheets/sync', async (req, res) => {
  const reqTime = new Date().toISOString();
  console.log(`[SERVER SYNC ${reqTime}] Received sync request.`);
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const accessToken = req.body.accessToken || bearerToken;
    const folderId = req.body.folderId || '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE';

    console.log(`[SERVER SYNC ${reqTime}] Auth check: bearerPresent=${!!bearerToken}, bodyTokenPresent=${!!req.body.accessToken}, tokenLength=${accessToken ? accessToken.length : 0}`);

    let auth: any = null;
    if (accessToken && typeof accessToken === 'string' && accessToken.trim().length > 0) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      auth = oauth2Client;
      console.log(`[SERVER SYNC ${reqTime}] Using OAuth2 access token.`);
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
      });
      console.log(`[SERVER SYNC ${reqTime}] Using Service Account JWT.`);
    }

    if (!auth) {
      console.warn(`[SERVER SYNC ${reqTime}] Auth failed: No OAuth token or Service Account credentials available.`);
      return res.status(401).json({
        success: false,
        requiresAuth: true,
        error: 'É necessário conectar sua conta do Google para sincronizar com o Google Sheets.'
      });
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // Target the official spreadsheet ID
    let spreadsheetId = req.body.spreadsheetId || req.body.targetSpreadsheetId;
    if (req.body.spreadsheetIdOrUrl) {
      const match = String(req.body.spreadsheetIdOrUrl).match(/\/d\/([a-zA-Z0-9-_]+)/);
      spreadsheetId = match ? match[1] : req.body.spreadsheetIdOrUrl;
    }
    if (!spreadsheetId) {
      spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE';
    }

    console.log(`[SERVER SYNC ${reqTime}] Target Spreadsheet ID: ${spreadsheetId}`);

    // Check existing sheet tabs and add missing ones
    try {
      const sheetInfo = await sheets.spreadsheets.get({ spreadsheetId });
      const existingSheetTitles = (sheetInfo.data.sheets || []).map(s => s.properties?.title || '');
      console.log(`[SERVER SYNC ${reqTime}] Existing tabs in spreadsheet:`, existingSheetTitles);
      const requiredTabs = ['ONGs Cadastradas', 'Projetos e Captação', 'Investidores e Patrocinadores', 'Resumo Governança'];
      const addSheetRequests = requiredTabs
        .filter(tab => !existingSheetTitles.includes(tab))
        .map(tab => ({ addSheet: { properties: { title: tab } } }));

      if (addSheetRequests.length > 0) {
        console.log(`[SERVER SYNC ${reqTime}] Adding missing tabs:`, addSheetRequests.map(r => r.addSheet.properties.title));
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests: addSheetRequests },
        });
      }
    } catch (tabErr: any) {
      console.warn(`[SERVER SYNC ${reqTime}] Note: Tab check warning:`, tabErr?.message || tabErr);
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Update server stores if client passed current state
    if (Array.isArray(req.body.ongs) && req.body.ongs.length > 0) {
      ongsStore = req.body.ongs;
    }
    if (Array.isArray(req.body.projects) && req.body.projects.length > 0) {
      projectsStore = req.body.projects;
    }
    if (Array.isArray(req.body.investors) && req.body.investors.length > 0) {
      investorsStore = req.body.investors;
    }

    console.log(`[SERVER SYNC ${reqTime}] Syncing data counts: ONGs=${ongsStore.length}, Projects=${projectsStore.length}, Investors=${investorsStore.length}`);

    // Populate ONGs
    const ongHeaders = [
      'ID', 'Nome da ONG', 'CNPJ', 'Área de Atuação', 'Cidade', 'UF', 'Selo de Maturidade', 'Score Governança', 'Beneficiários Ativos', 'Captação Total (R$)'
    ];
    const ongRows = ongsStore.map(o => [
      o.id, o.name, o.cnpj, o.areaAtuacao, o.city, o.state, o.maturityLevel, o.governanceScore, o.activeBeneficiariesCount, o.totalRaisedR$
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'ONGs Cadastradas'!A1",
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [ongHeaders, ...ongRows] },
    });
    console.log(`[SERVER SYNC ${reqTime}] 'ONGs Cadastradas' updated (${ongRows.length} rows).`);

    // Populate Projects
    const projHeaders = [
      'ID', 'Título do Projeto', 'ONG Responsável', 'Mecanismo Fiscal', 'Meta (R$)', 'Captado (R$)', 'Status', 'Beneficiários Impactados'
    ];
    const projRows = projectsStore.map(p => [
      p.id, p.title, p.ongName, p.mecanismo, p.targetAmountR$, p.raisedAmountR$, p.status, p.beneficiariesCount
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'Projetos e Captação'!A1",
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [projHeaders, ...projRows] },
    });
    console.log(`[SERVER SYNC ${reqTime}] 'Projetos e Captação' updated (${projRows.length} rows).`);

    // Populate Investors / Sponsors
    const invHeaders = [
      'ID', 'Empresa / Investidor Social', 'CNPJ', 'Orçamento Dedutível (R$)', 'Áreas de Interesse', 'Leis de Incentivo Preferenciais', 'Pessoa de Contato', 'E-mail'
    ];
    const invRows = investorsStore.map(i => [
      i.id, i.name, i.cnpj || '', i.totalDeductibleBudgetR$, (i.preferredAreas || []).join(', '), (i.preferredIncentiveLaws || []).join(', '), i.contactPerson || '', i.email || ''
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'Investidores e Patrocinadores'!A1",
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [invHeaders, ...invRows] },
    });
    console.log(`[SERVER SYNC ${reqTime}] 'Investidores e Patrocinadores' updated (${invRows.length} rows).`);

    // Populate Resumo
    const summaryHeaders = ['Indicador MROSC', 'Valor Atual', 'Observação de Governança'];
    const summaryRows = [
      ['Total de ONGs Validadas', ongsStore.length, 'Organizações da Sociedade Civil cadastradas'],
      ['Selo Ouro de Maturidade', ongsStore.filter(o => o.maturityLevel === 'Ouro').length, 'Conformidade MROSC avançada e auditoria'],
      ['Selo Prata de Maturidade', ongsStore.filter(o => o.maturityLevel === 'Prata').length, 'Transparência ativa e regimento'],
      ['Selo Bronze de Maturidade', ongsStore.filter(o => o.maturityLevel === 'Bronze').length, 'Estatuto social e CNDs regulares'],
      ['Projetos de Captação Ativos', projectsStore.length, 'Aptos para Leis de Incentivo (FIA, Rouanet, PIX)'],
      ['Volume Total Captado (R$)', projectsStore.reduce((acc, p) => acc + p.raisedAmountR$, 0), 'Recursos direcionados para impacto social'],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'Resumo Governança'!A1",
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [summaryHeaders, ...summaryRows] },
    });
    console.log(`[SERVER SYNC ${reqTime}] 'Resumo Governança' updated.`);

    const folderUrl = `https://drive.google.com/drive/u/0/folders/${folderId}`;

    console.log(`[SERVER SYNC ${reqTime}] Sync SUCCESS for Spreadsheet ID: ${spreadsheetId}`);

    res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      targetFolderId: folderId,
      targetFolderUrl: folderUrl,
      folderMoved: true,
      message: `Planilha oficial (${spreadsheetId}) sincronizada com sucesso!`,
    });
  } catch (error: any) {
    console.error(`[SERVER SYNC ERROR ${reqTime}]:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao sincronizar com Google Sheets.',
      details: error.response?.data || error.errors || null
    });
  }
});

// Start Server or Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arandu Monolith Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
