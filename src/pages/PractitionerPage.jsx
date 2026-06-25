import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/shared/DashboardLayout';
import PractitionerDashboard from '../components/practitioner/PractitionerDashboard';
import PractitionerTherapists from '../components/practitioner/PractitionerTherapists';
import PractitionerPatients from '../components/practitioner/PractitionerPatients';
import PractitionerSettings from '../components/practitioner/PractitionerSettings';

const PractitionerPage = () => {
  return (
    <DashboardLayout role="practitioner">
      <Routes>
        <Route path="/" element={<PractitionerDashboard />} />
        <Route path="/therapists" element={<PractitionerTherapists />} />
        <Route path="/patients" element={<PractitionerPatients />} />
        <Route path="/settings" element={<PractitionerSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PractitionerPage;
