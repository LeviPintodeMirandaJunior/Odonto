
import { Patient, Convenio, MedicalRecord } from './types';

export const INITIAL_CONVENIOS: Convenio[] = [
  { id: 'C-00', name: 'Particular', coverage: 'Total', repassePercent: 100, prazoDias: 0, status: 'Ativo' },
  { id: 'C-10', name: 'Convênio Prata', coverage: 'Nacional', repassePercent: 75, prazoDias: 30, status: 'Ativo' },
  { id: 'C-02', name: 'Amil Dental', coverage: 'Nacional', repassePercent: 70, prazoDias: 30, status: 'Ativo' },
  { id: 'C-03', name: 'SulAmérica', coverage: 'Completa', repassePercent: 80, prazoDias: 30, status: 'Ativo' },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-001',
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    convenioId: 'C-10',
    plan: 'Prata',
    lastVisit: '2024-05-20',
    status: 'Ativo',
    observations: 'Paciente em tratamento de canal.',
    visitHistory: [
      { date: '2024-05-20', procedure: 'Tratamento Canal', notes: 'Início da polpação.' },
      { date: '2024-04-12', procedure: 'Avaliação Inicial', notes: 'Dor no dente 32.' },
      { date: '2024-01-15', procedure: 'Limpeza Preventiva', notes: 'Retorno semestral.' }
    ]
  },
  {
    id: 'P-002',
    name: 'Maria Souza',
    cpf: '987.654.321-99',
    phone: '(11) 87654-3210',
    convenioId: 'C-00',
    plan: 'N/A - Particular',
    lastVisit: '2024-05-22',
    status: 'Ativo',
    visitHistory: [
      { date: '2024-05-22', procedure: 'Avaliação Geral', notes: 'Check-up completo.' },
      { date: '2023-11-05', procedure: 'Restauração', notes: 'Dente 14 com infiltração.' }
    ]
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  { id_paciente: 'P-001', nome_paciente: 'João Silva', id_convenio: 'C-10', nome_convenio: 'Convênio Prata', id_agendamento: 'AG-8001', data_consulta: '2024-05-20', procedimento: 'Tratamento Canal', valor_total: 1200.00, valor_pago: 0.00, status_pagamento: 'Pendente', emitiu_atestado: true },
  { id_paciente: 'P-002', nome_paciente: 'Maria Souza', id_convenio: 'C-00', nome_convenio: 'Particular', id_agendamento: 'AG-8002', data_consulta: '2024-05-22', procedimento: 'Avaliação Geral', valor_total: 350.00, valor_pago: 350.00, status_pagamento: 'Pago', emitiu_atestado: false },
  { id_paciente: 'P-001', nome_paciente: 'João Silva', id_convenio: 'C-10', nome_convenio: 'Convênio Prata', id_agendamento: 'AG-8003', data_consulta: '2024-05-25', procedimento: 'Restauração Resina', valor_total: 250.00, valor_pago: 250.00, status_pagamento: 'Pago', emitiu_atestado: false },
];

export const ATTENDANCE_TREND = [
  { month: 'Jan', visits: 45 },
  { month: 'Fev', visits: 52 },
  { month: 'Mar', visits: 48 },
  { month: 'Abr', visits: 61 },
  { month: 'Mai', visits: 55 },
  { month: 'Jun', visits: 67 },
  { month: 'Jul', visits: 72 },
];
