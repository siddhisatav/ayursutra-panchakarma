// import { useState, useEffect } from 'react';
// import Card from '../shared/Card';
// // import { getAppointments, updateAppointment } from '../../utils/storage';
// import { Users, Calendar, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
// import { useToast } from '../shared/ToastProvider';
// // import { therapists } from '../../data/mockData';
// import { getUser } from '../../utils/storage';

// const PractitionerDashboard = () => {
//   const [user] = useState(getUser());
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { showToast } = useToast();

//   const [therapists, setTherapists] = useState([]);

//   if (!user) {
//     return <div className="p-6">Loading user...</div>;
//   }

//   // Payment Assignment State
//   const [approvingId, setApprovingId] = useState(null);
//   const [paymentAmount, setPaymentAmount] = useState(500);
//   const [paymentMethod, setPaymentMethod] = useState('cash');

//   // useEffect(() => {
//   //   // Simulate loading for UI consistency
//   //   setLoading(true);
//   //   setTimeout(() => {
//   //     // setAppointments(getAppointments());
//   //     setLoading(false);
//   //   }, 500);
//   // }, []);

//   // const stats = {
//   //   total: appointments.length,
//   //   pending: appointments.filter(a => a.status === 'pending').length,
//   //   confirmed: appointments.filter(a => a.status === 'confirmed').length,
//   //   completed: appointments.filter(a => a.status === 'completed').length
//   // };

//   const uniquePatients = new Set(appointments.map(a => a.patientId));

//   const today = new Date().toISOString().split("T")[0];

//   const stats = {
//     patients: uniquePatients.size,
//     therapists: therapistsList.length,
//     appointments: appointments.filter(a => a.date === today).length
//   };

//   const updateStatus = async (id, status, extraData = {}) => {
//     try {
//       const payload = {
//         appointmentId: id,
//         status,
//         ...extraData
//       };

//       // If status is confirmed, we also set paymentStatus to pending as per requirement
//       if (status === 'confirmed') {
//         payload.paymentStatus = 'pending';
//       }

//       const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/update-appointment", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       if (res.ok) {
//         showToast(`Appointment ${status} successfully`, "success");
//         await loadAppointments();
//         setApprovingId(null);
//       } else {
//         throw new Error("Update failed");
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       showToast("Failed to update status", "error");
//     }
//   };
//   useEffect(() => {
//     if (!user) return;

//     loadAppointments();
//     loadTherapists();

//     const interval = setInterval(() => {
//       loadAppointments();
//       loadTherapists();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [user]);

//   const loadAppointments = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/appointments");
//       const data = await res.json();

//       setAppointments(data);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//    const loadTherapists = async () => {
//   try {
//     const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/therapists");
//     const data = await res.json();
//     setTherapistsList(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error("Therapist fetch error:", err);
//   }
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <Loader2 className="w-8 h-8 animate-spin text-ayur-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4">
//       <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Practitioner Dashboard</h1>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="hover:shadow-lg transition-shadow border-l-4 border-ayur-primary">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-ayur-accent rounded-lg text-ayur-primary">
//               <Users className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium">Total Patients</p>
//               <h3 className="text-2xl font-bold dark:text-white">{stats.patients}</h3>
//             </div>
//           </div>
//         </Card>

//         <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
//               <Users className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium">Therapists</p>
//               <h3 className="text-2xl font-bold dark:text-white">{stats.therapists}</h3>
//             </div>
//           </div>
//         </Card>

//         <Card className="hover:shadow-lg transition-shadow border-l-4 border-green-500">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-green-50 rounded-lg text-green-600">
//               <Calendar className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium">Appointments</p>
//               <h3 className="text-2xl font-bold dark:text-white">{stats.appointments}</h3>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Appointments */}
//         <Card className="overflow-hidden">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-serif font-bold dark:text-white">Recent Appointments</h2>
//             <Clock className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//             {Array.isArray(appointments) && appointments.length === 0 ? (
//               <p className="text-gray-500 text-center py-4 italic">No appointments found</p>
//             ) : (
//               Array.isArray(appointments) && appointments.map(a => (
//                 <div key={a.id} className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-bold text-gray-800 dark:text-gray-100">{a.patientName || 'Anonymous'}</p>
//                       <p className="text-sm text-ayur-primary font-medium">{a.therapyType}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {a.date} | {a.time}
//                       </p>
//                     </div>
//                     <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
//                       a.status === 'confirmed' || a.status === 'approved' ? 'bg-green-100 text-green-700' :
//                       a.status === 'rejected' ? 'bg-red-100 text-red-700' :
//                       a.status === 'completed' ? 'bg-blue-100 text-blue-700' :
//                       'bg-yellow-100 text-yellow-700'
//                     }`}>
//                       {a.status === 'confirmed' ? 'approved' : a.status}
//                     </span>
//                   </div>

//                   {a.status === 'pending' && approvingId !== a.id && (
//                     <div className="flex gap-2 mt-4">
//                       <button
//                         onClick={() => setApprovingId(a.id)}
//                         className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition-colors"
//                       >
//                         <CheckCircle className="w-3 h-3" /> Approve
//                       </button>
//                       <button
//                         onClick={() => updateStatus(a.id, "rejected")}
//                         className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded-lg transition-colors"
//                       >
//                         <XCircle className="w-3 h-3" /> Reject
//                       </button>
//                     </div>
//                   )}

//                   {approvingId === a.id && (
//                     <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
//                       <p className="text-sm font-semibold text-green-800 dark:text-green-300">Assign Fee & Payment Mode</p>
//                       <select 
//                         className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
//                         value={paymentMethod}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       >
//                         <option value="cash">Pay via Cash</option>
//                         <option value="online">Pay Online (Razorpay)</option>
//                       </select>
//                       <input 
//                         type="number"
//                         className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
//                         placeholder="Amount (₹)"
//                         value={paymentAmount}
//                         onChange={(e) => setPaymentAmount(e.target.value)}
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => updateStatus(a.id, "confirmed", { paymentMethod, amount: Number(paymentAmount) })}
//                           className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg font-bold"
//                         >
//                           Confirm & Assign
//                         </button>
//                         <button
//                           onClick={() => setApprovingId(null)}
//                           className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs py-2 rounded-lg font-bold"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>

//         {/* Top Therapists */}
//         <Card>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-serif font-bold dark:text-white">Therapists Overview</h2>
//             <Users className="w-5 h-5 text-gray-400" />
//           </div>
//           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
//             {Array.isArray(therapists) && therapists.length === 0 ? (
//                <p className="text-gray-500 text-center py-4 italic">No therapists active</p>
//             ) : (
//               Array.isArray(therapists) && therapists.map(t => (
//                 <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-700">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-ayur-accent flex items-center justify-center text-ayur-primary font-bold">
//                       {t.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{t.name}</p>
//                       <p className="text-[10px] text-gray-500">{t.specialization || 'Ayurvedic Practitioner'}</p>
//                     </div>
//                   </div>
//                   <span className={`flex items-center gap-1 text-[10px] font-bold ${
//                     !t.available ? "text-red-500" : "text-green-600"
//                   }`}>
//                     <div className={`w-1.5 h-1.5 rounded-full ${!t.available ? "bg-red-500" : "bg-green-500"}`} />
//                     {!t.available ? "BUSY" : "AVAILABLE"}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default PractitionerDashboard;



import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { Users, Calendar, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';
import { getUser } from '../../utils/storage';

const PractitionerDashboard = () => {
  const [user] = useState(getUser());
  const [appointments, setAppointments] = useState([]);
  const [therapistsList, setTherapistsList] = useState([]); // ✅ NEW
  const [selectedTherapistId, setSelectedTherapistId] = useState(''); // ✅ NEW
  const [dailyReport, setDailyReport] = useState(null); // ✅ NEW
  const [settings, setSettings] = useState({ dailySummary: false });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  // Payment Assignment State
  const [approvingId, setApprovingId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [prescriptionData, setPrescriptionData] = useState({
    assignedTherapy: '',
    duration: '',
    practitionerNotes: ''
  });

  // ✅ LOAD APPOINTMENTS
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD THERAPISTS (REAL API)
  const loadTherapists = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/therapists");
      const data = await res.json();
      setTherapistsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Therapist fetch error:", err);
    }
  };

  // ✅ LOAD DAILY REPORT
  const loadDailyReport = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/reports/daily");
      if (res.ok) {
        const data = await res.json();
        if (data.error) {
          setDailyReport({ disabled: true });
        } else {
          setDailyReport(data);
        }
      } else {
        setDailyReport({ disabled: true });
      }
    } catch (err) {
      console.error("Daily report fetch error:", err);
      setDailyReport({ disabled: true });
    }
  };

  // ✅ AUTO REFRESH
  useEffect(() => {
    if (!user) return;

    fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/notifications")
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(() => console.log("Using default settings"));

    loadAppointments();
    loadTherapists();
    loadDailyReport();

    const interval = setInterval(() => {
      fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/notifications")
        .then(res => res.json())
        .then(data => {
          if (data) setSettings(data);
        })
        .catch(() => console.log("Using default settings"));
      loadAppointments();
      loadTherapists();
      loadDailyReport();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // ✅ FIXED STATS
  const uniquePatients = new Set(appointments.map(a => a.patientId));
  const today = new Date().toISOString().split("T")[0];

  const stats = {
    patients: uniquePatients.size,
    therapists: therapistsList.length,
    appointments: appointments.filter(a => a.date === today).length
  };
  // ✅ CALCULATE REVENUE FROM PAID APPOINTMENTS
  const revenue = appointments
    .filter(a =>
      a.date === today &&
      (a.paymentStatus || "").toLowerCase() === "paid"
    )
    .reduce((sum, a) => sum + Number(a.amount || 0), 0);

  // ✅ AUTO-SUGGEST LEAST-BUSY THERAPIST (availability-based)
  const getAutoSuggestedTherapist = () => {
    if (therapistsList.length === 0) return '';
    const counts = therapistsList.map(t => ({
      id: t.id,
      count: appointments.filter(a => Number(a.therapistId) === Number(t.id) && a.status === 'confirmed').length
    }));
    counts.sort((a, b) => a.count - b.count);
    return String(counts[0].id);
  };

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status, extraData = {}) => {
    try {
      const payload = {
        appointmentId: id,
        status,
        ...extraData
      };

      if (status === 'confirmed') {
        payload.paymentStatus = 'pending';
      }

      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/update-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Appointment ${status} successfully`, "success");
        await loadAppointments();
        setApprovingId(null);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast("Failed to update status", "error");
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const res = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com/api/appointments/${id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid' })
      });

      if (!res.ok) {
        throw new Error('Unable to mark payment paid');
      }

      showToast('Payment marked as paid', 'success');
      await loadAppointments();
    } catch (err) {
      console.error('Payment update failed:', err);
      showToast('Failed to mark payment paid', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-ayur-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Practitioner Dashboard</h1>

      {/* ✅ STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p>Total Patients</p>
          <h3 className="text-2xl font-bold">{stats.patients}</h3>
        </Card>

        <Card>
          <p>Therapists</p>
          <h3 className="text-2xl font-bold">{stats.therapists}</h3>
        </Card>

        <Card>
          <p>Appointments Today</p>
          <h3 className="text-2xl font-bold">{stats.appointments}</h3>
        </Card>
      </div>

      {/* ✅ DAILY SUMMARY REPORT */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-bold dark:text-white">Daily Summary Report</h2>
        </div>
        {!settings.dailySummary ? (
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-gray-500 italic">Daily Summary Report is Disabled</p>
          </div>
        ) : dailyReport && !dailyReport.error ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 font-medium">Total Today</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dailyReport.total || 0}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{dailyReport.completed || 0}</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{dailyReport.pending || 0}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Revenue (₹)</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {revenue}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* APPOINTMENTS */}
        <Card>
          <h2>Recent Appointments</h2>

          {appointments.map(a => {
            // ✅ ID-based therapist name resolution using existing therapistsList
            const therapist = therapistsList.find(t => Number(t.id) === Number(a.therapistId));
            const resolvedTherapistName = therapist ? therapist.name : a.therapistName || 'Not Assigned';
            return (
              <div key={a.id} className="p-3 border rounded mt-2">
                <p className="font-medium text-gray-800 dark:text-gray-100">{a.patientName}</p>
                <p className="text-sm text-ayur-primary">{a.assignedTherapy || a.therapyType}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Therapist: {resolvedTherapistName}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    a.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    a.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {a.paymentStatus ? a.paymentStatus.toUpperCase() : 'PENDING'}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{(a.paymentMethod || 'cash').toUpperCase()}</span>
                  {a.paymentStatus === 'pending' && a.status !== 'cancelled' && (
                    <button
                      onClick={() => handleMarkAsPaid(a.id)}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-ayur-primary text-white hover:bg-ayur-primary/90 transition-colors"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>

              {a.status === 'pending' && approvingId !== a.id && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      const suggested = getAutoSuggestedTherapist();
                      setSelectedTherapistId(suggested);
                      setApprovingId(a.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}

              {approvingId === a.id && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">Assign Prescription</p>
                  <input
                    type="text"
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
                    placeholder={`Therapy (leave blank for ${a.assignedTherapy || a.therapyType})`}
                    value={prescriptionData.assignedTherapy}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, assignedTherapy: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
                    placeholder="Duration (Days)"
                    value={prescriptionData.duration}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, duration: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
                    placeholder="Notes for Therapist"
                    rows="2"
                    value={prescriptionData.practitionerNotes}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, practitionerNotes: e.target.value })}
                  ></textarea>

                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mt-2">
                    Assign Therapist
                    <span className="ml-2 text-[10px] font-normal text-blue-600 dark:text-blue-400">(auto-suggested: least busy)</span>
                  </p>
                  <select
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border border-green-300"
                    value={selectedTherapistId}
                    onChange={(e) => setSelectedTherapistId(e.target.value)}
                  >
                    <option value="">-- Select Therapist --</option>
                    {therapistsList.map(t => {
                      const confirmedCount = appointments.filter(a => Number(a.therapistId) === Number(t.id) && a.status === 'confirmed').length;
                      const isSuggested = String(t.id) === getAutoSuggestedTherapist();
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} ({confirmedCount} active){isSuggested ? ' ⭐ Suggested' : ''}
                        </option>
                      );
                    })}
                  </select>

                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mt-2">Assign Fee & Payment Mode</p>
                  <select
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Pay via Cash</option>
                    <option value="online">Pay Online (Razorpay)</option>
                  </select>

                  <input
                    type="number"
                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border"
                    placeholder="Amount (₹)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg font-bold"
                      onClick={() => {
                        if (!selectedTherapistId) {
                          showToast("Please select a therapist", "error");
                          return;
                        }
                        updateStatus(a.id, "confirmed", {
                          paymentMethod,
                          amount: Number(paymentAmount),
                          paymentStatus: "pending",
                          therapistId: selectedTherapistId,
                          ...prescriptionData
                        });
                      }}
                    >
                      Confirm & Assign
                    </button>
                    <button
                      className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs py-2 rounded-lg font-bold"
                      onClick={() => setApprovingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              </div>
            );
          })}
        </Card>

        {/* ✅ THERAPISTS (REAL DATA) */}
        <Card>
          <h2>Therapists Overview</h2>

          {therapistsList.length === 0 ? (
            <p>No therapists found</p>
          ) : (
            therapistsList.map(t => {
              const isBusy = appointments.some(
                a => a.therapistId === t.id && a.status === 'confirmed'
              );

              return (
                <div key={t.id} className="flex justify-between p-2 border mt-2">
                  <div>
                    <p>{t.name}</p>
                    <p>{t.specialization}</p>
                  </div>
                  <span>{isBusy ? "BUSY" : "AVAILABLE"}</span>
                </div>
              );
            })
          )}
        </Card>

      </div>
    </div>
  );
};

export default PractitionerDashboard;