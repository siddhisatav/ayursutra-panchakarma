import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/shared/DashboardLayout';
import TherapistDashboard from '../components/therapist/TherapistDashboard';
import TherapistPatients from '../components/therapist/TherapistPatients';
import TherapistSchedule from '../components/therapist/TherapistSchedule';
import TherapistProfile from '../components/therapist/TherapistProfile';

const TherapistPage = () => {
  return (
    <DashboardLayout role="therapist">
      <Routes>
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/patients" element={<TherapistPatients />} />
        <Route path="/schedule" element={<TherapistSchedule />} />
        <Route path="/profile" element={<TherapistProfile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TherapistPage;
