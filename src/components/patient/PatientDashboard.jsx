import { useState, useEffect } from 'react';
import { Calendar, BookOpen, User, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';
import { getUser } from '../../utils/storage';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientDashboard = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [therapistsList, setTherapistsList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        // ✅ Fetch appointments
        const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/appointments");
        const data = await res.json();
        const userAppointments = data.filter(apt => Number(apt.patientId) === Number(user.id));
        setAppointments(userAppointments);

        // ✅ Fetch therapists for ID-based name resolution
        const tRes = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/therapists");
        const tData = await tRes.json();
        setTherapistsList(Array.isArray(tData) ? tData : []);

        // ✅ Fetch session notes by patientId from dedicated API
        const nRes = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com/api/session_notes?patientId=${user.id}`);
        const nData = await nRes.json();
        setNotes(Array.isArray(nData) ? nData : []);

      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [user]);

  // Calculate Progress Dynamically
  const completed = appointments.filter(a => a.status === "completed" || a.status === "paid").length;
  const total = appointments.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeAppointments = appointments.filter(a => a.status === "confirmed");

  const chartData = {
    labels: appointments.length > 0 ? appointments.map((_, i) => `Session ${i + 1}`) : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Progress',
      data: appointments.length > 0 ? appointments.map((apt, index) => {
        const done = appointments.slice(0, index + 1).filter(a => a.status === "completed" || a.status === "paid").length;
        return Math.round((done / (index + 1)) * 100);
      }) : [0, 0, 0, 0],
      borderColor: '#4A7C59',
      backgroundColor: 'rgba(74, 124, 89, 0.2)',
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Therapy Completion (%)' }
    }
  };

  if (!user) return null;

  const appointmentMap = {};
  appointments.forEach(a => {
    appointmentMap[a.id] = a;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your Panchakarma therapy journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-ayur-primary to-ayur-secondary text-white">
          <Calendar className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{appointments.length}</h3>
          <p className="text-sm opacity-90">Appointments</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <TrendingUp className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{progressPercent}%</h3>
          <p className="text-sm opacity-90">Progress</p>
          <div className="mt-3 w-full bg-white/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <BookOpen className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{notes.length}</h3>
          <p className="text-sm opacity-90">Session Notes</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <User className="w-8 h-8 mb-2" />
          <h3 className="text-2xl font-bold">{activeAppointments.length}</h3>
          <p className="text-sm opacity-90">Active</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-ayur-dark dark:text-white">Therapy Progress</h2>
          <div style={{ height: "300px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <p className="text-lg font-bold mt-3 text-green-600 dark:text-green-400">
            {progressPercent}% Completed
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-ayur-dark dark:text-white">Upcoming Appointments</h2>
          {appointments.filter(a => a.status !== "completed" && a.status !== "paid").length > 0 ? (
            <div className="space-y-3">
              {appointments.filter(a => a.status !== "completed" && a.status !== "paid").slice(0, 3).map(apt => {
                // ✅ ID-based therapist name resolution
                const therapist = therapistsList.find(t => Number(t.id) === Number(apt.therapistId));
                const therapistName = therapist ? therapist.name : apt.therapistName || null;
                return (
                  <div key={apt.id} className="p-3 bg-ayur-light dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-ayur-dark dark:text-white">{apt.assignedTherapy || apt.therapyType}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{apt.date} at {apt.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Status: <span className="uppercase text-xs font-bold text-ayur-primary">{apt.status}</span>
                    </p>
                    {therapistName && (
                      <p className="text-xs text-ayur-primary font-medium mt-1">
                        👨‍⚕️ Therapist: {therapistName}
                      </p>
                    )}
                    {apt.duration && (
                      <>
                        <p className="text-xs text-gray-500 mt-1">
                          Day {apt.currentDay || 1} / {apt.duration}
                        </p>
                        <div className="w-full bg-gray-200 rounded h-1 mt-1">
                          <div
                            className="bg-green-500 h-1 rounded"
                            style={{ width: `${((apt.currentDay || 1) / apt.duration) * 100}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming appointments</p>
          )}
        </Card>
      </div>

      {/* ✅ SESSION NOTES SECTION */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-ayur-dark dark:text-white">Session Notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">No session notes recorded yet</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {notes.map(note => {
              const apt = appointmentMap[note.appointmentId]; // 👈 ADD HERE

              return (
                <div key={note.id} className="p-3 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">

                  {/* ✅ ADD THIS BLOCK */}
                  <p className="text-sm font-bold text-ayur-dark dark:text-white">
                    {apt?.assignedTherapy || apt?.therapyType || "Therapy"} • Day {note.dayNumber}
                  </p>

                  <p className="text-xs text-gray-500">
                    {apt?.date} at {apt?.time}
                  </p>

                  {/* Existing notes */}
                  {note.beforeNotes && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Before: </span>
                      {note.beforeNotes}
                    </p>
                  )}

                  {note.afterNotes && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-semibold">After: </span>
                      {note.afterNotes}
                    </p>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-r from-ayur-light to-ayur-beige dark:from-gray-700 dark:to-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-ayur-dark dark:text-white">Daily Reminder</h2>
        <p className="text-gray-700 dark:text-gray-300">Remember to follow your prescribed diet plan and take your herbal supplements on time.</p>
      </Card>
    </div>
  );
};

export default PatientDashboard;
