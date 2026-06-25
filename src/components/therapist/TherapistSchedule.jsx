import { useState, useEffect } from 'react';
import Card from '../shared/Card';
// import { getUser, getAppointments, updateAppointment } from '../../utils/storage';
import { Calendar, Clock, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';
import { getUser } from '../../utils/storage';
const TherapistSchedule = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  // const loadSchedule = async () => {
  //   try {
  //     setLoading(true);
  //     // const data = getAppointments().filter(a => a.therapistId === user?.id);
  //     setAppointments(data);
  //   } catch (err) {
  //     showToast("Error loading schedule", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadSchedule();
  // }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      showToast(`Status updated to ${status}`, "success");
      loadAppointments(); // Core refresh
    } catch (err) {
      console.error(err);
      showToast("Update failed", "error");
    }
  };

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

      console.log("USER ID:", user.id);
      console.log("ALL APPOINTMENTS:", data);

      const filtered = data.filter(
        a => Number(a.therapistId) === Number(user.id)
      );

      setAppointments(filtered);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-ayur-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ayur-dark dark:text-white mb-2">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your upcoming treatments</p>
        </div>
        <div className="bg-ayur-primary/10 px-4 py-2 rounded-lg border border-ayur-primary/20 flex items-center gap-2">
            <Calendar className="text-ayur-primary w-5 h-5" />
            <span className="text-ayur-dark font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <Card className="border-none shadow-xl">
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-ayur-light/50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ayur-dark dark:text-white">Time</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ayur-dark dark:text-white">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ayur-dark dark:text-white">Treatment</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ayur-dark dark:text-white">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ayur-dark dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {Array.isArray(appointments) && appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-ayur-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-ayur-dark dark:text-white">
                        <Clock className="w-4 h-4 text-ayur-primary" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 dark:text-white">{apt.patientName}</span>
                        <span className="text-[10px] text-gray-500">{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-ayur-accent/10 text-ayur-primary text-[10px] font-bold rounded uppercase tracking-wider">
                          {apt.assignedTherapy || apt.therapyType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        apt.status === 'confirmed' || apt.status === 'approved' ? 'bg-green-100 text-green-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirm"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark Completed"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        {(apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'approved') && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p className="text-xl font-serif italic">Your schedule is clear</p>
              <p className="text-sm mt-2">New appointments will appear here once booked.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TherapistSchedule;
