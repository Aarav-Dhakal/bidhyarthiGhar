import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building, Briefcase, ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'student',          label: 'Student',          Icon: GraduationCap, desc: 'Find rooms, roommates & services' },
  { id: 'landlord',         label: 'Landlord',         Icon: Building,      desc: 'List and manage your properties' },
  { id: 'service_provider', label: 'Service Provider', Icon: Briefcase,     desc: 'Offer laundry, food, printing etc.' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [activeRole, setActiveRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your full name.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setLoading(true);
    const result = await register({ name: name.trim(), email, password, role: activeRole });
    setLoading(false);

    if (result.success) {
      if (result.role === 'landlord') navigate('/landlord');
      else if (result.role === 'service_provider') navigate('/provider');
      else navigate('/dashboard');
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">

        {/* Brand */}
        <div className="text-center mb-8">
          <div onClick={() => navigate('/')}
            className="inline-flex items-center gap-2.5 cursor-pointer group mb-5">
            <div className="w-10 h-10 bg-blue-600 group-hover:bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-md transition-colors">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Bidhyarthi Ghar
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join 1,200+ students in Eastern Nepal
          </p>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl mb-6">
          {roles.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={(e) => { e.preventDefault(); setActiveRole(id); setError(''); }}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRole === id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
        {/* Role description */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 -mt-3 mb-5">
          {roles.find(r => r.id === activeRole)?.desc}
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-xs font-medium mb-5">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Full name
            </label>
            <input required type="text" value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Anisha Karki"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Email address
            </label>
            <input required type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input required type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Confirm password
            </label>
            <input required type="password" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            {loading ? 'Creating account…' : `Sign Up as ${roles.find(r => r.id === activeRole)?.label}`}
          </button>
        </form>

        {/* Footer links */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-5 space-y-3">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign in
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
