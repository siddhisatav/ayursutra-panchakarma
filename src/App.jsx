import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/shared/ToastProvider';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PatientPage from './pages/PatientPage';
import TherapistPage from './pages/TherapistPage';
import PractitionerPage from './pages/PractitionerPage';
import LandingPage from './pages/LandingPage';
import AppointmentBooking from './pages/AppointmentBooking';
import { initializeData, setupStorageSync } from './utils/storage';
import { useEffect, useState } from 'react';

function App() {
  useEffect(() => {
    // Setup the mock of localStorage to sync to backend
    setupStorageSync();
    // Initialize data from the backend
    initializeData();
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
<Route path="/" element={<LandingPage />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/therapist/*"
            element={
              <ProtectedRoute allowedRoles={['therapist']}>
                <TherapistPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/practitioner/*"
            element={
              <ProtectedRoute allowedRoles={['practitioner']}>
                <PractitionerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
