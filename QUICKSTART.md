# 🚀 Quick Start Guide - AyurSutra Panchakarma

## Installation Steps

### 1. Install Dependencies
```bash
cd ayursutra-panchakarma
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
Open your browser and go to: `http://localhost:5173`

## 🔐 Login Credentials

### Patient Account
```
Email: patient@ayur.com
Password: patient123
```

### Therapist Account
```
Email: therapist@ayur.com
Password: therapist123
```

### Practitioner Account
```
Email: practitioner@ayur.com
Password: practitioner123
```

## 📱 Testing the Application

### As a Patient:
1. Login with patient credentials
2. Navigate to "Appointments" to book a new therapy session
3. Select a therapist, therapy type, date, and time
4. View "Panchakarma Guide" for detailed therapy information
5. Go to "Profile" to add personal notes and view diet plan
6. Check dashboard for therapy progress visualization

### As a Therapist:
1. Login with therapist credentials
2. View dashboard for appointment statistics
3. Navigate to "My Patients" to manage patient appointments
4. Accept or reject pending appointments
5. Add therapy notes for patients
6. Assign diet plans to patients
7. Check "Schedule" for daily appointments

### As a Practitioner:
1. Login with practitioner credentials
2. View dashboard for center overview
3. Navigate to "Therapists" to manage therapist schedules
4. Go to "Patients" to see all patient records
5. Access "Settings" to configure center information

## 🎨 Features to Explore

### Dark Mode
- Click the moon/sun icon in the sidebar to toggle dark mode
- Preference is saved in localStorage

### Toast Notifications
- Perform any action (book appointment, add note, etc.)
- Watch for toast notifications in the top-right corner

### Responsive Design
- Resize your browser window
- Test on mobile, tablet, and desktop views

### Data Persistence
- All data is saved in localStorage
- Refresh the page - your data persists
- Clear browser data to reset

## 🛠️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 📦 Project Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **chart.js**: ^4.4.0
- **react-chartjs-2**: ^5.2.0
- **lucide-react**: ^0.294.0
- **tailwindcss**: ^3.3.6
- **vite**: ^5.0.7

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Dependencies Not Installing
Try:
```bash
npm cache clean --force
npm install
```

### Build Errors
Ensure you have Node.js v16 or higher:
```bash
node --version
```

## 📚 Next Steps

1. Explore all three user roles
2. Test appointment booking workflow
3. Try adding notes and assigning diet plans
4. Check the Panchakarma guide
5. Toggle dark mode
6. Test responsive design on different devices

## 💡 Tips

- Use browser DevTools to inspect localStorage data
- Check console for any errors or warnings
- All routes are protected - you must be logged in
- Each role has specific permissions and views

---

Enjoy exploring AyurSutra Panchakarma! 🌿
