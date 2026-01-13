
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  convenioId: string;
  plan: string;
  lastVisit?: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  observations?: string;
  visitHistory?: { date: string; procedure: string; notes: string }[];
}

export interface Convenio {
  id: string;
  name: string;
  coverage: string;
  repassePercent: number;
  prazoDias: number;
  status: 'Ativo' | 'Em análise' | 'Suspenso';
}

export interface MedicalRecord {
  id_agendamento: string;
  id_paciente: string;
  nome_paciente: string;
  id_convenio: string;
  nome_convenio: string;
  data_consulta: string;
  procedimento: string;
  valor_total: number;
  valor_pago: number;
  status_pagamento: 'Pago' | 'Parcial' | 'Pendente';
  emitiu_atestado: boolean;
}

export interface ChartData {
  name: string;
  value: number;
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  PATIENTS = 'PATIENTS',
  RECORDS = 'RECORDS',
  AI_ASSISTANT = 'AI_ASSISTANT'
}
