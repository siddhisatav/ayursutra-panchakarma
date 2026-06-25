# AyurSutra Panchakarma - Ayurvedic Therapy Center

A comprehensive static frontend website for an Ayurvedic Panchakarma therapy center with role-based dashboards, appointment booking, and therapy management.

## 🌿 Features

### Authentication
- Role-based login system (Patient, Therapist, Practitioner)
- Protected routes with role validation
- Mock authentication using localStorage

### Patient Dashboard
- **Appointment Booking**: Book therapy sessions with therapist selection and time slots
- **Therapy Progress Tracker**: Visual progress tracking using Chart.js
- **Panchakarma Guide**: Comprehensive guide covering:
  - What is Panchakarma
  - Therapy stages (Purvakarma, Pradhanakarma, Paschatkarma)
  - Benefits and care instructions
- **Personal Notes**: Add and manage personal therapy notes
- **Diet Plan Display**: View assigned diet plans
- **Therapist Availability**: Browse available therapists

### Therapist Dashboard
- **Patient Management**: View assigned patients
- **Appointment Actions**: Accept, reject, or reschedule appointments
- **Therapy Notes**: Add personal notes for each patient
- **Diet Plan Assignment**: Assign diet plans to patients
- **Daily Schedule**: Calendar view of appointments

### Practitioner Dashboard
- **Overview Statistics**: Total patients, therapists, and appointments
- **Therapist Management**: Manage therapist availability and schedules
- **Patient Overview**: View all patients and their treatment status
- **Settings**: Configure center information and preferences

### UI/UX Features
- **Ayurveda-inspired Theme**: Herbal green, beige, and earthy tones
- **Dark Mode**: Toggle between light and dark themes
- **Toast Notifications**: Real-time feedback for user actions
- **Responsive Design**: Mobile, tablet, and desktop support
- **Smooth Animations**: Hover effects and transitions

## 🛠️ Tech Stack

- **React 18** - Component-based architecture
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Chart.js & react-chartjs-2** - Progress visualization
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool
- **localStorage** - Data persistence

## 📁 Project Structure

```
ayursutra-panchakarma/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── patient/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── PatientAppointments.jsx
│   │   │   ├── PanchakarmaGuide.jsx
│   │   │   └── PatientProfile.jsx
│   │   ├── therapist/
│   │   │   ├── TherapistDashboard.jsx
│   │   │   ├── TherapistPatients.jsx
│   │   │   ├── TherapistSchedule.jsx
│   │   │   └── TherapistProfile.jsx
│   │   ├── practitioner/
│   │   │   ├── PractitionerDashboard.jsx
│   │   │   ├── PractitionerTherapists.jsx
│   │   │   ├── PractitionerPatients.jsx
│   │   │   └── PractitionerSettings.jsx
│   │   └── shared/
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Toast.jsx
│   │       ├── ToastProvider.jsx
│   │       └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── PatientPage.jsx
│   │   ├── TherapistPage.jsx
│   │   └── PractitionerPage.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── utils/
│   │   └── storage.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd ayursutra-panchakarma
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🔐 Demo Credentials

### Patient
- Email: `patient@ayur.com`
- Password: `patient123`

### Therapist
- Email: `therapist@ayur.com`
- Password: `therapist123`

### Practitioner
- Email: `practitioner@ayur.com`
- Password: `practitioner123`

## 🎨 Color Palette

- **Primary**: `#4A7C59` (Herbal Green)
- **Secondary**: `#8B9D83` (Sage Green)
- **Accent**: `#D4A574` (Golden Beige)
- **Light**: `#F5F1E8` (Cream)
- **Dark**: `#2C3E2F` (Forest Green)
- **Beige**: `#E8DCC4`
- **Cream**: `#FAF7F0`

## 📊 Data Storage

All data is stored in browser's localStorage:
- User authentication state
- Appointments
- Personal notes
- Diet plans
- Therapist availability
- Dark mode preference

## 🔄 Key Workflows

### Patient Journey
1. Login → Dashboard
2. View therapy progress
3. Book appointment (select therapist, therapy type, date, time)
4. Read Panchakarma guide
5. Add personal notes
6. View assigned diet plan

### Therapist Journey
1. Login → Dashboard
2. View assigned patients
3. Accept/reject appointments
4. Add therapy notes for patients
5. Assign diet plans
6. Check daily schedule

### Practitioner Journey
1. Login → Dashboard
2. View center statistics
3. Manage therapist schedules
4. Monitor patient treatments
5. Configure center settings

## 🌟 Features Highlights

- **Modular Components**: Reusable React components
- **Clean Code**: Well-commented and organized
- **Type Safety**: Proper prop handling
- **Responsive**: Works on all screen sizes
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized with Vite
- **User Feedback**: Toast notifications for all actions

## 📝 Notes

- This is a frontend-only application with no backend
- All data is simulated using localStorage
- No real API calls are made
- Perfect for portfolio or academic projects
- Can be easily extended with a real backend

## 🤝 Contributing

This is a static demo project. Feel free to fork and customize for your needs.

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a comprehensive Ayurvedic therapy center management system.

---

**Note**: This is a static frontend application using mock data. For production use, integrate with a proper backend API and database.
