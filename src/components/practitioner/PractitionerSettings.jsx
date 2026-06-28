import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { Settings, Bell, Shield, Database, Loader2, X } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';

const PractitionerSettings = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsReminders: true,
    dailySummary: false,
  });

  const [centerInfo, setCenterInfo] = useState({
    name: 'AyurSutra Panchakarma',
    email: 'contact@ayursutra.com',
    phone: '+91 98765 43210',
    address: '123 Wellness Street, Ayurveda City, India',
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [clearDataModalOpen, setClearDataModalOpen] = useState(false);

  useEffect(() => {
    fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/notifications")
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(() => console.log("Using default settings"));

    const fetchCenterSettings = async () => {
      try {
        setLoading(true);
        const centerRes = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/center").catch(() => null);
        if (centerRes && centerRes.ok) {
          const centerData = await centerRes.json();
          setCenterInfo(centerData);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCenterSettings();
  }, []);

  const handleToggle = async (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  const validateCenterInfo = () => {
    if (!centerInfo.name || !centerInfo.email || !centerInfo.phone || !centerInfo.address) {
      showToast("Fields cannot be empty", "error");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(centerInfo.email)) {
      showToast("Invalid email format", "error");
      return false;
    }
    const phoneDigits = centerInfo.phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      showToast("Phone must be 10–13 digits", "error");
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateCenterInfo()) return;

    try {
      setSaving(true);
      const [notifRes, centerRes] = await Promise.all([
        fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }),
        fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/center", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(centerInfo),
        }),
      ]);

      if (!notifRes.ok || !centerRes.ok) {
        throw new Error("Failed to save settings");
      }

      showToast("Settings saved successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Error saving settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showToast("Please fill all fields", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      if (res.ok) {
        showToast("Password changed successfully", "success");
        setPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      showToast("Error changing password", "error");
    }
  };

  const handleToggle2FA = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/settings/toggle-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        showToast("Two-Factor Authentication toggled successfully", "success");
      } else {
        throw new Error("Failed to toggle 2FA");
      }
    } catch (error) {
      console.error(error);
      showToast("Error toggling 2FA", "error");
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/patients/export");
      if (!res.ok) throw new Error("Failed to export data");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'patients_data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      showToast("Data exported successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Error exporting data", "error");
    }
  };

  const handleBackupDatabase = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/system/backup", { method: "POST" });
      if (res.ok) {
        showToast("Database backup successful", "success");
      } else {
        throw new Error("Backup failed");
      }
    } catch (error) {
      console.error(error);
      showToast("Error backing up database", "error");
    }
  };

  const handleClearAllData = async () => {
    try {
      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/system/clear", { method: "DELETE" });
      if (res.ok) {
        setClearDataModalOpen(false);
        showToast("All data cleared successfully", "success");
      } else {
        throw new Error("Failed to clear data");
      }
    } catch (error) {
      console.error(error);
      showToast("Error clearing data", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-ayur-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage center settings and preferences</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-ayur-primary" />
          <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-ayur-light dark:bg-gray-700 rounded-lg cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Email notifications for new appointments</span>
            <input 
              type="checkbox" 
              className="w-5 h-5" 
              checked={settings.emailNotifications}
              onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-ayur-light dark:bg-gray-700 rounded-lg cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">SMS reminders for patients</span>
            <input 
              type="checkbox" 
              className="w-5 h-5" 
              checked={settings.smsReminders}
              onChange={(e) => handleToggle('smsReminders', e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-ayur-light dark:bg-gray-700 rounded-lg cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Daily summary reports</span>
            <input 
              type="checkbox" 
              className="w-5 h-5" 
              checked={settings.dailySummary}
              onChange={(e) => handleToggle('dailySummary', e.target.checked)}
            />
          </label>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-ayur-primary" />
          <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Center Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Center Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={centerInfo.name}
              onChange={(e) => setCenterInfo({ ...centerInfo, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={centerInfo.email}
              onChange={(e) => setCenterInfo({ ...centerInfo, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input 
              type="tel" 
              className="input-field" 
              value={centerInfo.phone}
              onChange={(e) => setCenterInfo({ ...centerInfo, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea 
              className="input-field min-h-[80px]" 
              value={centerInfo.address}
              onChange={(e) => setCenterInfo({ ...centerInfo, address: e.target.value })}
            ></textarea>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-ayur-primary" />
          <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Security</h2>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => setPasswordModalOpen(true)}
            className="w-full p-3 bg-ayur-light dark:bg-gray-700 rounded-lg text-left hover:bg-ayur-beige dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-gray-700 dark:text-gray-300">Change Password</span>
          </button>
          <button 
            onClick={handleToggle2FA}
            className="w-full p-3 bg-ayur-light dark:bg-gray-700 rounded-lg text-left hover:bg-ayur-beige dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-ayur-primary" />
          <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Data Management</h2>
        </div>
        <div className="space-y-3">
          <button onClick={handleExportData} className="btn-secondary block w-full text-left">Export Patient Data</button>
          <button onClick={handleBackupDatabase} className="btn-secondary block w-full text-left">Backup Database</button>
          <button onClick={() => setClearDataModalOpen(true)} className="w-full text-left px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Clear All Data</button>
        </div>
      </Card>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveChanges}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Change Password</h2>
              <button onClick={() => setPasswordModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Current Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Confirm Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setPasswordModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button onClick={handleChangePassword} className="btn-primary">Save Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {clearDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Clear All Data</h2>
              <button onClick={() => setClearDataModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure? This action cannot be undone. All your settings and system data will be deleted permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setClearDataModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
              <button onClick={handleClearAllData} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Yes, Clear Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerSettings;
