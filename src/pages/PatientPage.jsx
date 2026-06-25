import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/shared/DashboardLayout';
import PatientDashboard from '../components/patient/PatientDashboard';
import PatientAppointments from '../components/patient/PatientAppointments';
import PanchakarmaGuide from '../components/patient/PanchakarmaGuide';
import PatientProfile from '../components/patient/PatientProfile';
import AIHealthAssistant from '../components/patient/AIHealthAssistant';

const PatientPage = () => {
  return (
    <DashboardLayout role="patient">
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/appointments" element={<PatientAppointments />} />
        <Route path="/guide" element={<PanchakarmaGuide />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/ai-assistant" element={<AIHealthAssistant />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientPage;
