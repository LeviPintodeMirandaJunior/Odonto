
import React, { useState } from 'react';
import { ViewType, Patient, Convenio, MedicalRecord } from './types';
import { INITIAL_PATIENTS, INITIAL_CONVENIOS, INITIAL_RECORDS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientTable from './components/PatientTable';
import AIAssistant from './components/AIAssistant';
import CameraModal from './components/CameraModal';
import MedicalRecordTable from './components/MedicalRecordTable';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [convenios] = useState<Convenio[]>(INITIAL_CONVENIOS);
  const [records] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [globalCaptures, setGlobalCaptures] = useState<string[]>([]);

  const handleGlobalCapture = (image: string) => {
    setGlobalCaptures(prev => [image, ...prev]);
    // Aqui poderíamos adicionar uma lógica de salvar no banco ou exibir um brinde/toast
    console.log("Foto capturada e salva na galeria temporária.");
  };

  const renderView = () => {
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard patients={patients} convenios={convenios} records={records} />;
      case ViewType.PATIENTS:
        return <PatientTable patients={patients} convenios={convenios} />;
      case ViewType.RECORDS:
        return <MedicalRecordTable records={records} patients={patients} />;
      case ViewType.AI_ASSISTANT:
        return <AIAssistant patients={patients} />;
      default:
        return <Dashboard patients={patients} convenios={convenios} records={records} />;
    }
  };

  return (
    <>
      <Layout 
        activeView={activeView} 
        setView={setActiveView} 
        onCameraClick={() => setIsCameraOpen(true)}
        captureCount={globalCaptures.length}
      >
        {renderView()}
      </Layout>
      
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleGlobalCapture}
      />
    </>
  );
};

export default App;
