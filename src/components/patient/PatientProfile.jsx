import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { useToast } from '../shared/ToastProvider';
import { getUser, addNote } from '../../utils/storage';
import { User, FileText, Utensils, Plus, Receipt, Heart, Activity } from 'lucide-react';

const PatientProfile = () => {
  const [user] = useState(getUser());
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [bills, setBills] = useState([]);
  const [healthProfile, setHealthProfile] = useState({
    age: '', gender: '', bodyType: 'Vata', symptoms: '',
    chronicDiseases: '', allergies: '', medications: '',
    stressLevel: 'Low', sleepQuality: 'Good', painLevel: 1, energyLevel: 'High'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const { showToast } = useToast();

  const loadPatientData = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/appointments");
      const data = await res.json();

      // filter current patient's appointments
      const myAppointments = data.filter(
        a => Number(a.patientId) === Number(user.id)
      );

      // Extract notes (all notes from appointments)
      const notesData = myAppointments
        .filter(a => a.notes)
        .map(a => ({
          id: a.id,
          content: a.notes,
          timestamp: new Date().toISOString()
        }));

      setNotes(notesData);

      // Get latest diet (last appointment with diet)
      const latestDiet = myAppointments
        .reverse()
        .find(a => a.diet);

      setDietPlan(latestDiet ? { description: latestDiet.diet } : null);

      // Get active appointment for timeline
      const active = myAppointments.find(a => a.status === 'confirmed' || a.status === 'pending');
      setActiveAppointment(active);

      // Fetch Bills from Backend
      const billsRes = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com/api/patient-bills/${user.id}`);
      const billsData = await billsRes.json();
      setBills(billsData || []);

      // Fetch Health Profile
      try {
        const hpRes = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com/api/health_profile/${user.id}`);
        if (hpRes.ok) {
          const hpData = await hpRes.json();
          setHealthProfile(prev => ({ ...prev, ...hpData }));
        }
      } catch (err) {
        console.error("Error loading health profile:", err);
      }

    } catch (err) {
      console.error(err);
      showToast("Failed to load patient data", "error");
    }
  };

  useEffect(() => {
    if (!user) return;
    loadPatientData();
  }, [user.id]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note = addNote(user.id, { content: newNote });
      setNotes([...notes, note]);
      setNewNote('');
      showToast('Note added successfully', 'success');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...healthProfile, patientId: user.id };
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/health_profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast("Health Profile saved successfully", "success");
        setIsEditingProfile(false);
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving health profile", "error");
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async (bill) => {
    const res = await loadRazorpay();
    if (!res) {
      showToast('Razorpay SDK failed to load', 'error');
      return;
    }
    try {
      // Step 1: Create Order
      const orderRes = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: bill.amount })
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const order = await orderRes.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "AyurSutra Panchakarma",
        description: "Therapy Payment",
        order_id: order.order_id,

        handler: async function (response) {
          try {
            await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                billId: bill.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            showToast("Payment Successful", "success");
            
            // Reload bills after payment
            const updated = await fetch(`https://ayursutra-panchakarma-f8cg.onrender.com/api/patient-bills/${user.id}`);
            setBills(await updated.json());
            
          } catch (err) {
            console.error(err);
            showToast("Payment verification error", "error");
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999"
        },

        theme: {
          color: "#4A7C59"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      showToast('Server error. Payment failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and notes</p>
      </div>

      <Card className="bg-gradient-to-r from-ayur-primary to-ayur-secondary text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-white/90">{user.email}</p>
            <p className="text-sm text-white/80 mt-1">Patient ID: #{user.id}</p>
          </div>
        </div>
      </Card>

      {/* HEALTH PROFILE SECTION */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-ayur-primary" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Health Profile & Progress Tracker</h2>
          </div>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)} 
            className="btn-secondary text-sm"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" className="input-field" value={healthProfile.age} onChange={e => setHealthProfile({...healthProfile, age: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select className="input-field" value={healthProfile.gender} onChange={e => setHealthProfile({...healthProfile, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Body Type (Dosha)</label>
                <select className="input-field" value={healthProfile.bodyType} onChange={e => setHealthProfile({...healthProfile, bodyType: e.target.value})}>
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stress Level</label>
                <select className="input-field" value={healthProfile.stressLevel} onChange={e => setHealthProfile({...healthProfile, stressLevel: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sleep Quality</label>
                <select className="input-field" value={healthProfile.sleepQuality} onChange={e => setHealthProfile({...healthProfile, sleepQuality: e.target.value})}>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Energy Level</label>
                <select className="input-field" value={healthProfile.energyLevel} onChange={e => setHealthProfile({...healthProfile, energyLevel: e.target.value})}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pain Level (1-10)</label>
                <input type="number" min="1" max="10" className="input-field" value={healthProfile.painLevel} onChange={e => setHealthProfile({...healthProfile, painLevel: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Symptoms (e.g. Joint pain, Indigestion)</label>
                <textarea className="input-field" rows="2" value={healthProfile.symptoms} onChange={e => setHealthProfile({...healthProfile, symptoms: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chronic Diseases</label>
                <textarea className="input-field" rows="2" value={healthProfile.chronicDiseases} onChange={e => setHealthProfile({...healthProfile, chronicDiseases: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <textarea className="input-field" rows="2" value={healthProfile.allergies} onChange={e => setHealthProfile({...healthProfile, allergies: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Medications</label>
                <textarea className="input-field" rows="2" value={healthProfile.medications} onChange={e => setHealthProfile({...healthProfile, medications: e.target.value})}></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">Save Profile</button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p><span className="font-semibold">Age:</span> {healthProfile.age || 'N/A'}</p>
              <p><span className="font-semibold">Gender:</span> {healthProfile.gender || 'N/A'}</p>
              <p><span className="font-semibold">Body Type:</span> {healthProfile.bodyType}</p>
              <p><span className="font-semibold">Stress Level:</span> {healthProfile.stressLevel}</p>
              <p><span className="font-semibold">Sleep Quality:</span> {healthProfile.sleepQuality}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Energy Level:</span> {healthProfile.energyLevel}</p>
              <p><span className="font-semibold">Pain Level:</span> {healthProfile.painLevel}/10</p>
              <p><span className="font-semibold">Symptoms:</span> {healthProfile.symptoms || 'None recorded'}</p>
              <p><span className="font-semibold">Chronic Diseases:</span> {healthProfile.chronicDiseases || 'None'}</p>
              <p><span className="font-semibold">Allergies:</span> {healthProfile.allergies || 'None'}</p>
              <p><span className="font-semibold">Medications:</span> {healthProfile.medications || 'None'}</p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-ayur-primary" />
              <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Personal Notes</h2>
            </div>
          </div>

          <form onSubmit={handleAddNote} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length > 0 ? (
              notes.map(note => (
                <div key={note.id} className="p-3 bg-ayur-light dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No notes yet</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-6 h-6 text-ayur-primary" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Diet Plan</h2>
          </div>

          {dietPlan ? (
            <div>
              {/* <h3 className="font-semibold text-lg text-ayur-dark dark:text-white mb-2">{dietPlan.name}</h3> */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">{dietPlan.description}</p>

              {/* <div className="space-y-4">
                {dietPlan.meals.map((meal, index) => (
                  <div key={index} className="p-3 bg-ayur-light dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-ayur-dark dark:text-white mb-2">{meal.time}</h4>
                    <ul className="space-y-1">
                      {meal.items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-ayur-primary rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div> */}
            </div>
          ) : (
            <div className="text-center py-8">
              <Utensils className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No diet plan assigned yet</p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-6 h-6 text-ayur-primary" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">My Bills & Payments</h2>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {bills.length > 0 ? (
              bills.map(bill => (
                <div key={bill.id} className="p-4 bg-ayur-light dark:bg-gray-700 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-ayur-dark dark:text-white">₹{bill.amount}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date: {bill.date}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Method: {(bill.paymentMethod || 'cash').toUpperCase()}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-sm rounded-full ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                    </span>
                    {bill.paymentStatus === 'pending' && bill.paymentMethod === 'online' && (
                      <button onClick={() => handleOnlinePayment(bill)} className="ml-3 px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                        Pay Online
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">Bills appear here once payment is processed or appointment is completed by your doctor.</p>
            )}
          </div>
        </Card>

        {/* TREATMENT TIMELINE SECTION */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-ayur-primary" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Treatment Timeline</h2>
          </div>
          <div className="space-y-4">
            {activeAppointment && activeAppointment.duration ? (
              [...Array(activeAppointment.duration)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeAppointment.currentDay > i + 1 ? 'bg-green-100 text-green-700' : activeAppointment.currentDay === i + 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-ayur-dark dark:text-white">
                      Day {i + 1} {i === 0 ? '→ Initial Consultation & Prep' : `→ ${activeAppointment.assignedTherapy || activeAppointment.therapyType}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeAppointment.currentDay > i + 1 ? 'Completed' : activeAppointment.currentDay === i + 1 ? 'In Progress (Today)' : 'Upcoming'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-gray-500 dark:text-gray-400 text-center py-8">No active treatment plan assigned yet.</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PatientProfile;
