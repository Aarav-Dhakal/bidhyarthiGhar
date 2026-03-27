import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building, Briefcase, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'student',          label: 'Student',          Icon: GraduationCap, color: 'blue',  desc: 'Find housing & community' },
  { id: 'landlord',         label: 'Landlord',         Icon: Building,      color: 'indigo', desc: 'Manage your properties' },
  { id: 'service_provider', label: 'Service Provider', Icon: Briefcase,     color: 'teal',  desc: 'Offer local services' },
  { id: 'admin',            label: 'Admin',            Icon: ShieldCheck,   color: 'red',   desc: 'Platform administration' },
];

const accentClass = {
  blue:   { tab: 'text-blue-600 dark:text-blue-400',   btn: 'bg-blue-600 hover:bg-blue-700',   ring: 'focus:ring-blue-500' },
  indigo: { tab: 'text-indigo-600 dark:text-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700', ring: 'focus:ring-indigo-500' },
  teal:   { tab: 'text-teal-600 dark:text-teal-400',   btn: 'bg-teal-600 hover:bg-teal-700',   ring: 'focus:ring-teal-500' },
  red:    { tab: 'text-red-600 dark:text-red-400',     btn: 'bg-red-600 hover:bg-red-700',     ring: 'focus:ring-red-500' },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = ROLES.find(r => r.id === activeRole);
  const accent = accentClass[role.color];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'landlord') navigate('/landlord');
      else if (result.role === 'service_provider') navigate('/provider');
      else navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">

        {/* Brand */}
        <div className="text-center mb-7">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2.5 cursor-pointer group mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors ${accent.btn}`}>
              <role.Icon size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Bidhyarthi Ghar</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select your role and sign in</p>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl mb-2">
          {ROLES.map(({ id, label, Icon, color }) => (
            <button key={id} type="button"
              onClick={(e) => { e.preventDefault(); setActiveRole(id); setError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRole === id
                  ? `bg-white dark:bg-gray-700 ${accentClass[color].tab} shadow-sm`
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mb-5">{role.desc}</p>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-xs font-medium mb-5">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Email address
            </label>
            <input required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 ${accent.ring} focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500`} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input required type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 ${accent.ring} focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500`} />
          </div>

          <button type="submit"
            disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed ${accent.btn}`}>
            {loading ? 'Signing in…' : `Sign in as ${role.label}`}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-5 space-y-3">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign up free
            </button>
          </p>
          <button onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium">
            <ArrowLeft size={13} /> Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}