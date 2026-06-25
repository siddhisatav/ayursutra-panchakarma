import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Modal from '../shared/Modal';
import { useToast } from '../shared/ToastProvider';
import { getUser } from '../../utils/storage';
import { timeSlots, therapyTypes } from '../../data/mockData';
import { Calendar, Clock, User, XCircle } from 'lucide-react';

const PatientAppointments = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    therapistId: '',
    therapyType: '',
    date: '',
    time: ''
  });
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/therapists")
      .then(res => res.json())
      .then(data => setTherapists(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching therapists:", err));
  }, []);
  const { showToast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, [user.id]);

  const loadAppointments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/appointments");
      const data = await res.json();
      const userAppointments = data.filter(apt => Number(apt.patientId) === Number(user.id));
      setAppointments(userAppointments);
    } catch (err) {
      console.error("Error loading appointments:", err);
      showToast("Failed to load appointments", "error");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/update-appointment", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: id, status: 'cancelled' })
        });
        
        if (res.ok) {
          setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt));
          showToast('Appointment cancelled successfully', 'success');
        } else {
          throw new Error("Failed to cancel");
        }
      } catch (err) {
        console.error(err);
        showToast("Error cancelling appointment", "error");
      }
    }
  };

  const handleRecommendation = () => {
    const issue = window.prompt("Briefly describe your main issue (e.g., stress, digestion, joint pain, toxins):");
    if (!issue) return;
    
    const lowerIssue = issue.toLowerCase();
    let suggestedTherapy = "";
    
    if (lowerIssue.includes("stress") || lowerIssue.includes("insomnia") || lowerIssue.includes("anxiety")) {
      suggestedTherapy = "Shirodhara";
    } else if (lowerIssue.includes("digest") || lowerIssue.includes("acidity") || lowerIssue.includes("stomach")) {
      suggestedTherapy = "Virechana";
    } else if (lowerIssue.includes("joint") || lowerIssue.includes("pain") || lowerIssue.includes("arthritis")) {
      suggestedTherapy = "Basti";
    } else if (lowerIssue.includes("toxin") || lowerIssue.includes("detox") || lowerIssue.includes("weight")) {
      suggestedTherapy = "Vamana";
    } else {
      showToast("Could not find a specific match, please select manually.", "info");
      return;
    }

    if (suggestedTherapy) {
      setFormData({ ...formData, therapyType: suggestedTherapy });
      showToast(`Recommended Therapy: ${suggestedTherapy}`, "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const therapy = therapyTypes.find(t => t.name === formData.therapyType);
    
    const newAppointment = {
      patientName: user.name,
      patientId: Number(user.id),
      therapistId: Number(formData.therapistId),
      therapyType: therapy.name,
      date: formData.date,
      time: formData.time,
      status: 'pending'
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/api/appointments", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });

      if (res.ok) {
        await loadAppointments();
        setIsModalOpen(false);
        setFormData({ therapistId: '', therapyType: '', date: '', time: '' });
        showToast('Appointment booked successfully!', 'success');
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Error booking appointment", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ayur-dark dark:text-white">My Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your therapy sessions</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map(apt => {
          // ✅ ID-based therapist name resolution
          const therapist = therapists.find(t => Number(t.id) === Number(apt.therapistId));
          const resolvedTherapistName = therapist ? therapist.name : apt.therapistName || 'Not Assigned';
          return (
            <Card key={apt.id}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-ayur-dark dark:text-white">{apt.assignedTherapy || apt.therapyType}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{resolvedTherapistName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{apt.time}</span>
                </div>
              </div>

              {(apt.status === 'pending' || apt.status === 'confirmed') && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Appointment
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {appointments.length === 0 && (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No appointments yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Book your first Panchakarma therapy session</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            Book Appointment
          </button>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book New Appointment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Therapist</label>
            <select
              value={formData.therapistId}
              onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Choose a therapist</option>
              {therapists.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Therapy Type</label>
              <button 
                type="button" 
                onClick={handleRecommendation}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Not sure? Get Recommendation
              </button>
            </div>
            <select
              value={formData.therapyType}
              onChange={(e) => setFormData({ ...formData, therapyType: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Choose therapy</option>
              {therapyTypes.map(t => (
                <option key={t.id} value={t.name}>{t.name} - {t.duration}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Slot</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Choose time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary w-full">
            Confirm Booking
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PatientAppointments;
