
// Enums
export enum Priority {
  URGENT = 'Urgente',
  HIGH = 'Alta',
  MEDIUM = 'Média',
  LOW = 'Baixa',
}

export enum ProjectStatus {
  PLANNING = 'Em planejamento',
  EXECUTION = 'Em execução',
  PAUSED = 'Pausado',
  COMPLETED = 'Concluído',
  CONTINUOUS = 'Contínuo',
}

export enum ProjectType {
  LAUNCH = 'Lançamento',
  CONTINUOUS = 'Contínuo',
  INTERNAL = 'Interno',
  ADJUSTMENT = 'Ajuste pontual',
}

export enum TaskStatus {
  BACKLOG = 'Backlog',
  PLANNED = 'Planejado',
  IN_PROGRESS = 'Em execução',
  WAITING_CLIENT = 'Aguardando retorno',
  APPROVAL = 'Em aprovação',
  COMPLETED = 'Concluído',
  PAUSED = 'Pausado',
}

export enum ContractType {
  RETAINER = 'Fixo / Mensal',
  ONE_OFF = 'Pontual / Projeto / Job',
}

export enum AgendaViewMode {
  WEEK = 'Semana',
  FORTNIGHT = 'Quinzena',
  MONTH = 'Mês',
}

export enum ClientCategory {
  DRUMS = 'Bateria',
  REAL_ESTATE = 'Imobiliário',
  HEALTH = 'Saúde',
  ARCHITECTURE = 'Arquitetura',
}

export enum TaskType {
  LANDING = 'Landing Page',
  COPY = 'Copywriting',
  DESIGN = 'Design',
  REVIEW = 'Revisão',
  AUTOMATION = 'Automação',
}

// Interfaces
export interface Client {
  id: string;
  name: string;
  brand: string;
  category: string;
  contractType: ContractType;
  color: string;
  weeklyHours: number;
  minDailyHours: number;
  priority: Priority;
  observations?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  type: ProjectType;
  startDate: string;
  estimatedDeadline: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  clientId: string;
  projectId: string;
  status: TaskStatus;
  type: string;
  priority: Priority;
  estimatedHours: number;
  deadline: string;
  startTime?: string;
  createdAt: string;
  completedAt?: string;
  isRecurring: boolean;
}

export interface VisualConfig {
  themeMode: 'light' | 'dark';
  agencyName: string;
  userName: string; // Novo campo
  logoUrl?: string;
}

export interface AppConfig {
  totalHoursPerDay: number;
  workWindowStart: string;
  workWindowEnd: string;
  notes: string;
  workDays: number[];
  visual: VisualConfig;
}
