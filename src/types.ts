export type MaturityLevel = 'None' | 'Bronze' | 'Prata' | 'Ouro';

export type AreaAtuacao = 
  | 'Educação e Pesquisa'
  | 'Assistência Social'
  | 'Saúde e Pessoas com Deficiência'
  | 'Meio Ambiente e Causa Animal'
  | 'Cultura e Arte'
  | 'Esporte e Lazer'
  | 'Direitos Humanos e Cidadania'
  | 'Desenvolvimento Comunitário';

export type MecanismoCaptacao = 
  | 'FIA' // Fundo da Infância e Adolescência
  | 'Lei Rouanet' // Cultura
  | 'Lei do Esporte' // Esporte
  | 'PRONON / PRONAS' // Saúde
  | 'Fundo do Idoso'
  | 'MROSC / Parceria Pública'
  | 'Doação Direta PIX'
  | 'Investimento Social Privado';

export interface GovernanceRequirement {
  id: string;
  title: string;
  description: string;
  level: 'Bronze' | 'Prata' | 'Ouro';
  category: 'Jurídico & Estatutário' | 'Financeiro & Contábil' | 'Transparência & Gestão' | 'Compliance & Impacto';
  requiredForLegalCompliance: boolean; // e.g. MROSC / Lei 13.019
  checked: boolean;
  notes?: string;
  documentUrl?: string;
}

export interface ONG {
  id: string;
  name: string;
  tradeName?: string;
  cnpj: string;
  areaAtuacao: AreaAtuacao;
  state: string;
  city: string;
  foundingYear: number;
  mission: string;
  summary: string;
  email: string;
  phone: string;
  website?: string;
  pixKey?: string;
  logoUrl?: string;
  coverUrl?: string;
  maturityLevel: MaturityLevel;
  governanceScore: number; // 0 to 100
  requirements: GovernanceRequirement[];
  createdProjectsCount?: number;
  totalRaisedR$: number;
  activeBeneficiariesCount: number;
  verifiedStatus: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  ongId: string;
  ongName: string;
  title: string;
  summary: string;
  description: string;
  mecanismo: MecanismoCaptacao;
  targetAmountR$: number;
  raisedAmountR$: number;
  odsList: number[]; // e.g. [1, 4, 10] ODS da ONU
  beneficiariesCount: number;
  startDate: string;
  endDate: string;
  status: 'Em Captação' | 'Em Execução' | 'Concluído';
  budgetBreakdown: { item: string; amountR$: number }[];
  imageUrl?: string;
}

export interface Investor {
  id: string;
  name: string;
  cnpj: string;
  type: 'Lucro Real' | 'Lucro Presumido' | 'Pessoa Física' | 'Fundação Empresarial';
  totalDeductibleBudgetR$: number;
  contactPerson: string;
  email: string;
  phone: string;
  preferredAreas: string[];
  preferredIncentiveLaws: string[];
  createdAt: string;
}

export interface DonorSimulation {
  donorType: 'PF' | 'PJ';
  annualIncomeOrProfitR$: number;
  taxRegime?: 'Lucro Real' | 'Declaração Completa (IRPF)';
  simulatedDonationR$: number;
  estimatedTaxDeductionR$: number;
  netCostR$: number;
}

export interface AIDiagnosticResult {
  overallScore: number; // 0-100
  maturityAssessed: MaturityLevel;
  keyStrengths: string[];
  criticalGaps: string[];
  roadmap30Days: string[];
  roadmap60Days: string[];
  roadmap90Days: string[];
  recommendedIncentiveLaws: MecanismoCaptacao[];
  suggestedActionPlans: { title: string; detail: string; priority: 'Alta' | 'Média' | 'Baixa' }[];
}
