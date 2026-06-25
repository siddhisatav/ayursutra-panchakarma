import { useState, useEffect } from 'react';
import Card from '../shared/Card';
// import { getAppointments } from '../../utils/storage';
import { User, Calendar, FileText, Loader2, Eye } from 'lucide-react';
import { getUser } from '../../utils/storage';
import Modal from '../shared/Modal';
import { useToast } from '../shared/ToastProvider';

const PractitionerPatients = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [therapistsList, setTherapistsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { showToast } = useToast();

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  useEffect(() => {
    if (!user) return;

    loadAppointments();

    const interval = setInterval(() => {
      loadAppointments();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/api/appointments");
      const data = await res.json();
      setAppointments(data);

      // ✅ Fetch therapists for ID-based name resolution
      const tRes = await fetch("http://127.0.0.1:5000/api/therapists");
      const tData = await tRes.json();
      setTherapistsList(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (patientId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/health_profile/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProfile(data);
        setIsProfileModalOpen(true);
      } else {
        showToast("No Health Profile found for this patient.", "info");
      }
    } catch (err) {
      console.error(err);
      showToast("Error fetching Health Profile", "error");
    }
  };

  const uniquePatients = [...new Map(appointments.map(apt => [apt.patientId, apt])).values()];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-ayur-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">Patient Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">View all registered patients</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Patient Name</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Therapy Type</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Therapist</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Status</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Date</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Payment</th>
                <th className="text-left py-3 px-4 text-ayur-dark dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-ayur-light dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-ayur-primary" />
                      <span className="font-medium text-ayur-dark dark:text-white">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{apt.assignedTherapy || apt.therapyType}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {(() => {
                      const t = therapistsList.find(t => Number(t.id) === Number(apt.therapistId));
                      return t ? t.name : apt.therapistName || 'Not Assigned';
                    })()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{apt.date}</td>
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                    {apt.amount ? `₹${apt.amount}` : '--'}
                  </td>
                  <td className="py-3 px-4">
                    {apt.paymentStatus ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        apt.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.paymentStatus.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleViewProfile(apt.patientId)}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {appointments.length === 0 && (
        <Card className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No patients yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Patient data will appear here</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <User className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{uniquePatients.length}</h3>
          <p className="text-sm opacity-90">Total Patients</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <Calendar className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{appointments.filter(a => a.status === 'confirmed').length}</h3>
          <p className="text-sm opacity-90">Active Treatments</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <FileText className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</h3>
          <p className="text-sm opacity-90">Completed</p>
        </Card>
      </div>

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Patient Health Profile">
        {selectedProfile ? (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold text-ayur-dark dark:text-white">Age:</span> {selectedProfile.age || 'N/A'}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Gender:</span> {selectedProfile.gender || 'N/A'}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Body Type:</span> {selectedProfile.bodyType}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Stress Level:</span> {selectedProfile.stressLevel}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Sleep Quality:</span> {selectedProfile.sleepQuality}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Energy Level:</span> {selectedProfile.energyLevel}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Pain Level:</span> {selectedProfile.painLevel}/10</p>
            </div>
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold text-ayur-dark dark:text-white">Symptoms:</span><br/> {selectedProfile.symptoms || 'None recorded'}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Chronic Diseases:</span><br/> {selectedProfile.chronicDiseases || 'None'}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Allergies:</span><br/> {selectedProfile.allergies || 'None'}</p>
              <p><span className="font-semibold text-ayur-dark dark:text-white">Medications:</span><br/> {selectedProfile.medications || 'None'}</p>
            </div>
            <button onClick={() => setIsProfileModalOpen(false)} className="btn-primary w-full mt-4">Close</button>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Profile data not available.
          </div>
        )}
      </Modal>

    </div>
  );
};

export default PractitionerPatients;
