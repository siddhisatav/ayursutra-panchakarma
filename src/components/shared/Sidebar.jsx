import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, User, Users, Settings, LogOut, Moon, Sun, Sparkles, MessageSquare } from 'lucide-react';
import { logout } from '../../utils/storage';
import { useToast } from './ToastProvider';

const Sidebar = ({ role, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const patientLinks = [
    { path: '/patient',                icon: Home,          label: 'Dashboard' },
    { path: '/patient/appointments',   icon: Calendar,      label: 'Appointments' },
    { path: '/patient/guide',          icon: BookOpen,      label: 'Panchakarma Guide' },
    { path: '/patient/ai-assistant',   icon: Sparkles,      label: 'AI Health Assistant' },
    { path: '/patient/profile',        icon: User,          label: 'Profile' },
  ];

  const therapistLinks = [
    { path: '/therapist', icon: Home, label: 'Dashboard' },
    { path: '/therapist/patients', icon: Users, label: 'My Patients' },
    { path: '/therapist/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/therapist/profile', icon: User, label: 'Profile' }
  ];

  const practitionerLinks = [
    { path: '/practitioner', icon: Home, label: 'Dashboard' },
    { path: '/practitioner/therapists', icon: Users, label: 'Therapists' },
    { path: '/practitioner/patients', icon: Users, label: 'Patients' },
    { path: '/practitioner/settings', icon: Settings, label: 'Settings' }
  ];

  const links = role === 'patient' ? patientLinks : role === 'therapist' ? therapistLinks : practitionerLinks;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-serif font-bold text-ayur-primary">AyurSutra</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Panchakarma Center</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? 'sidebar-link-active' : ''}`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="sidebar-link w-full"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
