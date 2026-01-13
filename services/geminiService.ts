
import { GoogleGenAI, Type } from "@google/genai";
import { Patient, Convenio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIPatientSummary = async (patients: Patient[], convenios: Convenio[]) => {
  const patientData = patients.map(p => `${p.name} (Convênio: ${convenios.find(c => c.id === p.convenioId)?.name})`).join('; ');
  const financialData = convenios.map(c => `${c.name}: Repasse ${c.repassePercent}%, Reembolso em ${c.prazoDias} dias`).join('; ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise a situação da clínica. Dados de pacientes: ${patientData}. Regras de Convênios: ${financialData}`,
    config: {
      systemInstruction: `Você é um gestor financeiro de clínica médica. 
      Sua tarefa é gerar um "Resumo IA" em 3 pontos curtos e muito claros:
      1. Saúde do Fluxo de Caixa (analise prazos de reembolso e % de repasse).
      2. Concentração de Pacientes (quais convênios trazem mais volume vs rentabilidade).
      3. Sugestão estratégica para maximizar o lucro imediato (ex: priorizar atendimentos particulares ou convênios com melhor repasse).
      Responda de forma direta e profissional em Português Brasileiro.`,
      temperature: 0.3,
    },
  });
  return response.text;
};

export const getPatientDetailedAnalysis = async (patient: Patient, convenio?: Convenio) => {
  const context = `
    Paciente: ${patient.name}
    Convênio: ${convenio?.name || 'Não informado'}
    Observações: ${patient.observations || 'Nenhuma'}
    Histórico: ${patient.visitHistory?.map(h => `${h.date}: ${h.procedure} (${h.notes})`).join('; ') || 'Sem histórico'}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um resumo clínico rápido para o paciente: ${context}`,
    config: {
      systemInstruction: `Você é um assistente médico sênior. Forneça um resumo executivo de 2 frases sobre o perfil do paciente, destacando pontos de atenção ou oportunidades de cuidado preventivo. Seja conciso e profissional em Português Brasileiro.`,
      temperature: 0.5,
    },
  });
  return response.text;
};

export const chatWithMedicalAI = async (message: string, context?: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `Você é um assistente de IA médico para a plataforma MediTrack Pro. Ajude a gerenciar a clínica e responda dúvidas médicas gerais com base no seguinte contexto da clínica: ${context || 'Nenhum contexto específico fornecido'}.`,
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || []
  };
};

export const getPatientFollowup = async (patient: Patient) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sugira 3 ações de acompanhamento (follow-up) para o paciente ${patient.name} que possui o plano ${patient.plan}. Última visita foi em ${patient.lastVisit}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] },
            description: { type: Type.STRING }
          },
          required: ["action", "priority", "description"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};
