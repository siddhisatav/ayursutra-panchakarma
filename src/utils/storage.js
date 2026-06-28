// localStorage utility functions acting as a cache for the Python Backend

const STORAGE_KEYS = {
  USER: 'ayur_current_user',
  APPOINTMENTS: 'ayur_appointments',
  NOTES: 'ayur_notes',
  DIET_PLANS: 'ayur_diet_plans',
  THERAPIST_AVAILABILITY: 'ayur_therapist_availability',
  DARK_MODE: 'ayur_dark_mode',
  BILLS: 'ayur_bills'
};

const API_BASE = 'https://ayursutra-panchakarma-f8cg.onrender.com/api';

// --- User Authentication ---
export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  // In a real app we might post login to backend here
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// --- Appointments ---
export const saveAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const getAppointments = () => {
  const appointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!appointments) return [];
  try {
    const parsed = JSON.parse(appointments);
    // Auto-heal any appointments that got nested due to the bill update route
    return parsed.map(apt => apt.appointment ? apt.appointment : apt);
  } catch (e) {
    return [];
  }
};

export const addAppointment = (appointment) => {
  const appointments = getAppointments();
  // Optimistic UI update
  const tempId = Date.now();
  const newAppointment = { ...appointment, id: tempId };
  appointments.push(newAppointment);
  saveAppointments(appointments);

  // Sync to Backend
  fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment)
  }).then(r => r.json()).then(serverApt => {
    // Replace temp id with real id from server
    const apts = getAppointments();
    const idx = apts.findIndex(a => a.id === tempId);
    if (idx !== -1) {
      apts[idx] = serverApt.appointment ? serverApt.appointment : serverApt;
      saveAppointments(apts);
    }
  }).catch(console.error);

  return newAppointment;
};

export const updateAppointment = (id, updates) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(apt => apt.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    saveAppointments(appointments);
    
    // Sync to backend (only send updates if it's not a temp ID)
    if (id < 1000000000000) { 
      fetch(`${API_BASE}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(console.error);
    }
  }
};

// --- Notes ---
export const saveNotes = (userId, notesList) => {
  const allNotes = getAllNotes();
  allNotes[userId] = notesList;
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
};

export const getNotes = (userId) => {
  const allNotes = getAllNotes();
  return allNotes[userId] || [];
};

export const getAllNotes = () => {
  const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
  return notes ? JSON.parse(notes) : {};
};

export const addNote = (userId, note) => {
  const notesList = getNotes(userId);
  const newNote = { ...note, id: Date.now(), timestamp: new Date().toISOString() };
  notesList.push(newNote);
  saveNotes(userId, notesList);

  // Sync to backend
  fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: userId,
      text: newNote.text,
      date: newNote.timestamp,
      authorName: newNote.authorName
    })
  }).catch(console.error);

  return newNote;
};

// --- Diet Plans ---
export const saveDietPlan = (patientId, dietPlan) => {
  const allPlans = getAllDietPlans();
  allPlans[patientId] = dietPlan;
  localStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(allPlans));

  // Sync to Backend
  fetch(`${API_BASE}/diet_plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: patientId,
      planData: dietPlan
    })
  }).catch(console.error);
};

export const getDietPlan = (patientId) => {
  const allPlans = getAllDietPlans();
  return allPlans[patientId] || null;
};

export const getAllDietPlans = () => {
  const plans = localStorage.getItem(STORAGE_KEYS.DIET_PLANS);
  return plans ? JSON.parse(plans) : {};
};

// --- Bills ---
export const saveBills = (patientId, bills) => {
  const allBills = getAllBills();
  allBills[patientId] = bills;
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(allBills));
};

export const getBills = (patientId) => {
  const allBills = getAllBills();
  return allBills[patientId] || [];
};

export const getAllBills = () => {
  const bills = localStorage.getItem(STORAGE_KEYS.BILLS);
  return bills ? JSON.parse(bills) : {};
};

export const fetchBillsForPatient = async (patientId) => {
  try {
    const res = await fetch(`${API_BASE}/bills/${patientId}`);
    if (res.ok) {
      const bills = await res.json();
      saveBills(patientId, bills);
      return bills;
    }
  } catch (error) {
    console.error("Failed to fetch bills", error);
  }
  return getBills(patientId);
};

// --- Therapist Availability ---
export const saveTherapistAvailability = (availability) => {
  localStorage.setItem(STORAGE_KEYS.THERAPIST_AVAILABILITY, JSON.stringify(availability));
};

export const getTherapistAvailability = () => {
  const availability = localStorage.getItem(STORAGE_KEYS.THERAPIST_AVAILABILITY);
  return availability ? JSON.parse(availability) : {};
};

// --- Dark Mode ---
export const saveDarkMode = (isDark) => {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
};

export const getDarkMode = () => {
  const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  return darkMode ? JSON.parse(darkMode) : false;
};

// We don't need setupStorageSync anymore since we do targeted API calls.
export const setupStorageSync = () => {
    // Deprecated. We're using direct API routing now.
};

// --- Initialization ---
export const initializeData = async () => {
  try {
    const responses = await Promise.allSettled([
      fetch(`${API_BASE}/appointments`).then(r => r.json()),
      fetch(`${API_BASE}/notes`).then(r => r.json()),
      fetch(`${API_BASE}/diet_plans`).then(r => r.json())
    ]);

    const appointmentsRes = responses[0];
    const notesRes = responses[1];
    const dietPlansRes = responses[2];

    if (appointmentsRes.status === 'fulfilled' && Array.isArray(appointmentsRes.value)) {
      saveAppointments(appointmentsRes.value);
    }

    if (notesRes.status === 'fulfilled' && Array.isArray(notesRes.value)) {
      const notesByPatient = {};
      notesRes.value.forEach(n => {
        if (!notesByPatient[n.patientId]) notesByPatient[n.patientId] = [];
        notesByPatient[n.patientId].push({
          id: n.id,
          text: n.text,
          authorName: n.authorName,
          timestamp: n.date
        });
      });
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesByPatient));
    }

    if (dietPlansRes.status === 'fulfilled' && Array.isArray(dietPlansRes.value)) {
      const dietPlansByPatient = {};
      dietPlansRes.value.forEach(p => {
        dietPlansByPatient[p.patientId] = p.planData;
      });
      localStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(dietPlansByPatient));
    }

  } catch (error) {
    console.warn("Backend not running or error fetching data", error);
  }

  // Ensure default arrays exist
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) saveAppointments([]);
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) localStorage.setItem(STORAGE_KEYS.NOTES, "{}");
  if (!localStorage.getItem(STORAGE_KEYS.DIET_PLANS)) localStorage.setItem(STORAGE_KEYS.DIET_PLANS, "{}");
  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) localStorage.setItem(STORAGE_KEYS.BILLS, "{}");
};
