import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { Search, FileText, Utensils, Send, Loader2, User, Clock } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';
import { getUser } from '../../utils/storage';

const TherapistPatients = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [note, setNote] = useState('');
  const [diet, setDiet] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { showToast } = useToast();

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const filteredPatients = safeAppointments.filter(apt =>
    (apt.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((apt.assignedTherapy || apt.therapyType) || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load treatment history for the selected appointment
  const loadHistory = async (apt) => {
    if (!apt?.id) return;
    try {
      setHistoryLoading(true);
      const res = await fetch(`http://127.0.0.1:5000/api/treatment-history/${apt.id}`);
      const data = await res.json();
      setTreatmentHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setTreatmentHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUpdate = async (type) => {
    if (!selectedApt) return;
    try {
      setSubmitting(true);

      const payload = { appointmentId: selectedApt.id };
      if (type === 'note') payload.notes = note;
      else if (type === 'diet') payload.diet = diet;

      // (A) Existing: update appointment.notes / appointment.diet
      const response = await fetch("http://127.0.0.1:5000/api/update-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update");

      showToast(`${type === 'note' ? 'Notes' : 'Diet'} updated successfully`, "success");

      // (B) New: insert a permanent session history record
      const sessionPayload = {
        appointment_id:       selectedApt.id,
        patient_id:           selectedApt.patientId,
        therapist_id:         user.id,
        therapist_name:       user.name,
        treatment_notes:      type === 'note' ? note : (selectedApt.notes || ''),
        dietary_prescription: type === 'diet' ? diet : (selectedApt.diet || ''),
      };

      await fetch("http://127.0.0.1:5000/api/add-treatment-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionPayload),
      });

      // Refresh appointments and history
      await loadAppointments();
      await loadHistory(selectedApt);

    } catch (err) {
      console.error(err);
      showToast("Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadAppointments();
    const interval = setInterval(() => { loadAppointments(); }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/api/appointments");
      const data = await res.json();
      const filtered = data.filter(a => Number(a.therapistId) === Number(user.id));
      setAppointments(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format helpers
  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return ts; }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch { return ts; }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ayur-dark dark:text-white mb-2">My Patients</h1>
          <p className="text-gray-600 dark:text-gray-400">Track treatment progress and dietary plans</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-ayur-accent/20 rounded-xl focus:ring-2 focus:ring-ayur-primary/50 outline-none w-full md:w-64 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {Array.isArray(filteredPatients) && filteredPatients.map((apt) => (
            <div
              key={`${apt.id}-${apt.patientId}`}
              onClick={() => {
                setSelectedApt(apt);
                setNote(apt.notes || '');
                setDiet(apt.diet || '');
                loadHistory(apt);
              }}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedApt?.id === apt.id
                  ? 'bg-ayur-primary text-white border-ayur-primary shadow-lg scale-[1.02]'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-ayur-primary/30'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedApt?.id === apt.id ? 'bg-white text-ayur-primary' : 'bg-ayur-primary/10 text-ayur-primary'
                  }`}>
                  {apt.patientName?.charAt(0) || "P"}
                </div>
                <div>
                  <h3 className="font-bold">{apt.patientName}</h3>
                  <p className={`text-xs ${selectedApt?.id === apt.id ? 'opacity-90' : 'text-gray-500'}`}>
                    {apt.assignedTherapy || apt.therapyType}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredPatients.length === 0 && (
            <p className="text-center text-gray-400 py-12 italic">No patients found</p>
          )}
        </div>

        {/* Treatment Panel */}
        <div className="lg:col-span-2">
          {selectedApt ? (
            <Card className="border-none shadow-2xl h-full animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 rounded-2xl bg-ayur-accent/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-ayur-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-ayur-dark dark:text-white">
                    {selectedApt.patientName}
                  </h2>
                  <p className="text-ayur-primary font-medium">{selectedApt.assignedTherapy || selectedApt.therapyType}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Treatment Notes — unchanged */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-ayur-dark dark:text-white mb-2 uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> Treatment Notes
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter patient diagnosis, progress, or session notes..."
                    className="w-full h-32 p-4 border border-ayur-accent/10 rounded-xl focus:ring-2 focus:ring-ayur-primary/50 outline-none dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleUpdate('note')}
                      disabled={submitting}
                      className="btn-primary py-2 px-6 flex items-center gap-2 text-sm"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Update Notes
                    </button>
                  </div>
                </div>

                {/* Dietary Prescription — unchanged */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-ayur-dark dark:text-white mb-2 uppercase tracking-wider">
                    <Utensils className="w-4 h-4" /> Dietary Prescription
                  </label>
                  <textarea
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    placeholder="Describe the Ayurvedic diet or restricted foods..."
                    className="w-full h-32 p-4 border border-ayur-accent/10 rounded-xl focus:ring-2 focus:ring-ayur-primary/50 outline-none dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleUpdate('diet')}
                      disabled={submitting}
                      className="btn-primary py-2 px-6 flex items-center gap-2 text-sm bg-ayur-accent hover:bg-ayur-accent/80 border-none"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                      Assign Diet
                    </button>
                  </div>
                </div>

                {/* ── Clinical Timeline (NEW) ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <Clock className="w-4 h-4 text-ayur-primary" />
                    <span className="text-sm font-bold text-ayur-dark dark:text-white uppercase tracking-wider">
                      Clinical Timeline
                    </span>
                    {treatmentHistory.length > 0 && (
                      <span className="ml-auto text-xs bg-ayur-primary/10 text-ayur-primary px-2 py-0.5 rounded-full font-medium">
                        {treatmentHistory.length} session{treatmentHistory.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {historyLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-ayur-primary w-5 h-5" />
                    </div>
                  ) : treatmentHistory.length === 0 ? (
                    <p className="text-gray-400 italic text-sm text-center py-8">
                      No session history yet. Updates will appear here after saving.
                    </p>
                  ) : (
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }} className="space-y-3 pr-1">
                      {treatmentHistory.map((session, idx) => (
                        <div
                          key={session.session_id}
                          className="rounded-xl border border-ayur-accent/15 bg-gradient-to-r from-ayur-primary/5 to-transparent p-4 dark:border-gray-700 dark:bg-gray-800/50"
                        >
                          {/* Card header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold bg-ayur-primary text-white px-2 py-0.5 rounded-full">
                                Session {treatmentHistory.length - idx}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(session.created_at)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatTime(session.created_at)}
                            </span>
                          </div>

                          {/* Therapist */}
                          <p className="text-xs font-semibold text-ayur-primary mb-2">
                            {session.therapist_name || 'Therapist'}
                          </p>

                          {/* Notes */}
                          {session.treatment_notes && (
                            <div className="mb-1">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Treatment Notes:
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5 leading-relaxed">
                                {session.treatment_notes}
                              </p>
                            </div>
                          )}

                          {/* Diet */}
                          {session.dietary_prescription && (
                            <div className="mt-1">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Diet:
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5 leading-relaxed">
                                {session.dietary_prescription}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* ── End Clinical Timeline ── */}

              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center py-32 text-gray-400 border-dashed border-2 border-gray-100 dark:border-gray-700">
              <User size={64} className="mb-4 opacity-10" />
              <p className="text-xl font-serif italic">Select a patient to view details</p>
              <p className="text-sm mt-2">Manage notes and diet plans for individual patients.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistPatients;
