import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, School, Calendar, Wallet, Settings, 
  ArrowLeft, Save, CheckCircle2, AlertCircle, ShieldCheck, MailQuestion, PhoneForwarded, GraduationCap, Camera, Upload
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatar_url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.updateProfile(profile);
      await refreshUser();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-12">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          {/* Header */}
          <div className="bg-blue-600 px-8 py-10 text-white relative">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.[0].toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border border-gray-100 dark:border-gray-800">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile?.name}</h1>
                <p className="opacity-80 text-sm font-medium uppercase tracking-wider">{profile?.role}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 rounded-2xl px-5 py-4 text-sm font-medium mb-8">
                <CheckCircle2 size={18} /> {message}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl px-5 py-4 text-sm font-medium mb-8">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Basic Info Section */}
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <User size={20} className="text-blue-600" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input disabled type="email" value={profile.email}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none" />
                      {profile.email_verified ? (
                        <ShieldCheck className="absolute right-3 top-3 text-green-500" size={18} />
                      ) : (
                        <button type="button" className="absolute right-3 top-2.5 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-bold hover:bg-blue-200 transition-colors">Verify</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="tel" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      {profile.phone_verified ? (
                        <ShieldCheck className="absolute right-3 top-3 text-green-500" size={18} />
                      ) : (
                        <button type="button" className="absolute right-3 top-2.5 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-bold hover:bg-blue-200 transition-colors">Verify</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Specific Section */}
              {profile.role === 'student' && (
                <div className="space-y-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <GraduationCap size={20} className="text-blue-600" /> Education & Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College / University</label>
                      <div className="relative">
                        <School className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" value={profile.college || ''} onChange={e => setProfile({...profile, college: e.target.value})}
                          placeholder="e.g. IIC College, Itahari"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year / Semester</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select value={profile.year || ''} onChange={e => setProfile({...profile, year: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Budget (NPR)</label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="number" value={profile.budget || ''} onChange={e => setProfile({...profile, budget: e.target.value})}
                          placeholder="e.g. 8000"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferences (WiFi, Water, etc.)</label>
                      <div className="relative">
                        <Settings className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" value={profile.preferences || ''} onChange={e => setProfile({...profile, preferences: e.target.value})}
                          placeholder="e.g. Attached bath, Wi-Fi, No curfew"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 pt-4 flex gap-4">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50">
                  <Save size={20} />
                  {saving ? 'Saving changes...' : 'Save Profile Details'}
                </button>
                <button type="button" onClick={() => { logout(); navigate('/login'); }}
                  className="px-6 py-4 rounded-2xl font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 transition-colors">
                  Logout
                </button>
              </div>

            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'recently'}
        </p>

      </div>
    </div>
  );
}
