import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { getUser, saveUser } from '../../utils/storage';
import { User, Mail, Award, BookOpen, Calendar, Clock, Loader2, Edit2, Save, X } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';

const TherapistProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = getUser();
        if (user) {
          setProfile(user);
          setFormData(user);
        }
      } catch (err) {
        showToast("Failed to load profile", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Prepare data to send to backend
      const updateData = {
        id: profile.id,
        name: formData.name,
        experience: formData.experience,
        specialization: formData.specialization,
        shiftTiming: formData.shiftTiming,
        qualification: formData.qualification,
        bio: formData.bio
      };

      const response = await fetch('http://localhost:5000/api/therapist/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setFormData(updatedData);
      saveUser(updatedData);
      setIsEditing(false);
      showToast("Profile Updated Successfully", "success");
    } catch (err) {
      showToast("Failed to save profile", "error");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-ayur-primary" />
        <p className="ml-2 text-gray-500 font-serif italic">Fetching your professional profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <User size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-serif font-bold text-gray-800">Profile Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn't load your therapist data. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif font-bold text-ayur-dark dark:text-white">Therapist Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-ayur-primary text-white rounded-lg hover:bg-ayur-primary/90 transition-colors shadow-md"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-none shadow-xl flex flex-col items-center text-center p-8 bg-gradient-to-b from-ayur-primary/5 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="w-24 h-24 rounded-full bg-ayur-primary text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg border-4 border-white dark:border-gray-700">
              {(isEditing ? formData.name : profile?.name)?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-ayur-dark dark:text-white">{isEditing ? formData.name : profile?.name}</h2>
            <p className="text-ayur-primary font-medium text-sm mb-4">{isEditing ? formData.specialization || "Not listed" : profile?.specialization || "Ayurvedic Expert"}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
              <Calendar size={12} />
              Joined March 2024
            </div>
          </Card>

          <Card className="md:col-span-2 border-none shadow-xl p-8">
            <h3 className="text-lg font-bold text-ayur-dark dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">Professional Details</h3>

            {!isEditing ? (
              // View Mode
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">{profile?.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Award size={12} /> Experience
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">{profile?.experience || "Not listed"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={12} /> Specialization
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">{profile?.specialization || "Not listed"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Shift Timing
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {profile?.shiftTiming || "Not listed"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Award size={12} /> Qualification
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">{profile?.qualification || "Not listed"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={12} /> About
                  </label>
                  <p className="text-gray-700 dark:text-gray-200 font-medium text-sm">{profile?.bio || "Not listed"}</p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      placeholder="e.g., 5 years"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      placeholder="e.g., Panchakarma"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Shift Timing
                    </label>
                    <input
                      type="text"
                      name="shiftTiming"
                      value={formData.shiftTiming || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      placeholder="e.g., 09:00 - 17:00"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                      placeholder="e.g., B.A.M.S."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    About / Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
                    placeholder="Tell us about yourself, your experience, and approach to therapy..."
                    rows="4"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-ayur-primary text-white rounded-lg hover:bg-ayur-primary/90 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-ayur-primary/5 rounded-xl border border-ayur-primary/10 italic text-sm text-gray-600 dark:text-gray-400">
              Authorized Ayurvedic Practitioner registered under AyurSutra Health Systems.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
