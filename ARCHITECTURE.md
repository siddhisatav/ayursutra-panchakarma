# 🏗️ Component Architecture - AyurSutra Panchakarma

## Application Structure

```
App.jsx (Root)
├── BrowserRouter
├── ToastProvider (Global Toast Notifications)
└── Routes
    ├── /login → Login Component
    ├── /patient/* → ProtectedRoute → PatientPage
    ├── /therapist/* → ProtectedRoute → TherapistPage
    └── /practitioner/* → ProtectedRoute → PractitionerPage
```

## Component Hierarchy

### 🔐 Authentication Layer
```
Login.jsx
├── Uses: users from mockData
├── Functions: saveUser(), navigate()
└── Redirects to role-based dashboard

ProtectedRoute.jsx
├── Checks: getUser()
├── Validates: user role
└── Redirects: unauthorized users
```

### 👤 Patient Module
```
PatientPage.jsx
└── DashboardLayout (role="patient")
    └── Routes
        ├── / → PatientDashboard.jsx
        │   ├── Card (x4 - Statistics)
        │   ├── Line Chart (Chart.js)
        │   └── Appointment List
        │
        ├── /appointments → PatientAppointments.jsx
        │   ├── Card (Appointment Cards)
        │   └── Modal (Booking Form)
        │       ├── Therapist Select
        │       ├── Therapy Type Select
        │       ├── Date Input
        │       └── Time Slot Select
        │
        ├── /guide → PanchakarmaGuide.jsx
        │   ├── Card (Introduction)
        │   ├── Card (Stages x3)
        │   ├── Card (Benefits)
        │   └── Card (Pre/Post Care)
        │
        └── /profile → PatientProfile.jsx
            ├── Card (User Info)
            ├── Card (Personal Notes)
            │   └── Note Form + List
            └── Card (Diet Plan)
                └── Meal Cards
```

### 👨⚕️ Therapist Module
```
TherapistPage.jsx
└── DashboardLayout (role="therapist")
    └── Routes
        ├── / → TherapistDashboard.jsx
        │   ├── Card (x4 - Statistics)
        │   └── Schedule List
        │
        ├── /patients → TherapistPatients.jsx
        │   ├── Card (Patient Cards)
        │   └── Modal (x2)
        │       ├── Add Note Modal
        │       └── Assign Diet Modal
        │
        ├── /schedule → TherapistSchedule.jsx
        │   └── Card (Grouped by Date)
        │       └── Appointment Timeline
        │
        └── /profile → TherapistProfile.jsx
            ├── Card (Profile Header)
            └── Card (x3 - Info Cards)
```

### 👨💼 Practitioner Module
```
PractitionerPage.jsx
└── DashboardLayout (role="practitioner")
    └── Routes
        ├── / → PractitionerDashboard.jsx
        │   ├── Card (x4 - Statistics)
        │   ├── Card (Recent Appointments)
        │   └── Card (Therapist Status)
        │
        ├── /therapists → PractitionerTherapists.jsx
        │   ├── Card (Therapist Cards)
        │   └── Modal (Schedule Management)
        │
        ├── /patients → PractitionerPatients.jsx
        │   ├── Card (Patient Table)
        │   └── Card (x3 - Statistics)
        │
        └── /settings → PractitionerSettings.jsx
            ├── Card (Notifications)
            ├── Card (Center Info)
            ├── Card (Security)
            └── Card (Data Management)
```

## 🧩 Shared Components

### Layout Components
```
DashboardLayout.jsx
├── Sidebar.jsx
│   ├── Logo/Header
│   ├── Navigation Links (role-based)
│   ├── Dark Mode Toggle
│   └── Logout Button
└── Main Content Area
    └── {children}
```

### UI Components
```
Card.jsx
├── Props: children, className, onClick
└── Styling: card class with hover effects

Modal.jsx
├── Props: isOpen, onClose, title, children
├── Backdrop (click to close)
└── Content Container

Toast.jsx
├── Props: message, type, onClose, duration
├── Types: success, error, info
└── Auto-dismiss timer

ToastProvider.jsx
├── Context: ToastContext
├── Hook: useToast()
├── Functions: showToast(), removeToast()
└── Toast Container (fixed position)
```

## 📊 Data Flow

### Authentication Flow
```
User Input (Login)
    ↓
Validate against mockData.users
    ↓
saveUser() → localStorage
    ↓
Navigate to /{role}
    ↓
ProtectedRoute validates
    ↓
Render Dashboard
```

### Appointment Booking Flow
```
Patient selects therapist/therapy/date/time
    ↓
Form submission
    ↓
addAppointment() → localStorage
    ↓
Update local state
    ↓
Show toast notification
    ↓
Close modal
```

### Therapist Action Flow
```
Therapist views patient list
    ↓
Clicks action (Accept/Note/Diet)
    ↓
updateAppointment() or saveDietPlan()
    ↓
Update localStorage
    ↓
Reload data
    ↓
Show toast notification
```

## 🗄️ State Management

### Component-Level State
```
useState() for:
- Form inputs
- Modal visibility
- Local data lists
- UI toggles
```

### Global State (Context)
```
ToastContext
├── toasts array
├── showToast()
└── removeToast()
```

### Persistent State (localStorage)
```
storage.js utilities:
├── User session
├── Appointments
├── Notes
├── Diet plans
├── Therapist availability
└── Dark mode preference
```

## 🎨 Styling Architecture

### Tailwind Configuration
```
tailwind.config.js
├── Custom colors (ayur theme)
├── Font families
└── Dark mode: 'class'
```

### CSS Layers
```
index.css
├── @tailwind base
├── @tailwind components
│   ├── .btn-primary
│   ├── .btn-secondary
│   ├── .card
│   ├── .input-field
│   └── .sidebar-link
└── @tailwind utilities
```

## 🔌 External Dependencies

### Chart.js Integration
```
PatientDashboard.jsx
├── Import: Chart.js components
├── Register: Chart elements
├── Data: chartData object
└── Render: <Line /> component
```

### React Router Integration
```
App.jsx
├── BrowserRouter wrapper
├── Routes container
└── Route definitions
    ├── path
    ├── element
    └── nested routes (*)
```

### Lucide Icons
```
Import icons as needed:
├── Calendar
├── User
├── Settings
├── LogOut
└── 50+ more icons
```

## 📱 Responsive Breakpoints

```
Mobile:     < 768px   (1 column layouts)
Tablet:     768-1024px (2 column layouts)
Desktop:    > 1024px   (3-4 column layouts)
```

## 🎯 Key Design Patterns

1. **Component Composition**: Small, reusable components
2. **Props Drilling**: Minimal, using context where needed
3. **Controlled Components**: Form inputs with state
4. **Conditional Rendering**: Role-based UI
5. **Higher-Order Components**: ProtectedRoute wrapper
6. **Custom Hooks**: useToast()
7. **Utility Functions**: storage.js helpers

## 🔄 Component Lifecycle

```
Mount
├── useEffect() - Load data from localStorage
├── Initialize state
└── Render UI

Update
├── User interaction
├── State change
├── Re-render affected components
└── Update localStorage

Unmount
├── Cleanup timers (Toast)
└── Remove event listeners
```

---

This architecture ensures:
✅ Modularity
✅ Reusability
✅ Maintainability
✅ Scalability
✅ Clean separation of concerns
