import { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import { getUser, getDarkMode, saveDarkMode } from '../../utils/storage';

const DashboardLayout = ({ children, role }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = getDarkMode();
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex min-h-screen bg-ayur-cream dark:bg-gray-900">
      <Sidebar role={role} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
