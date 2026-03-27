import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Facebook, Instagram, Twitter, GraduationCap,
  Mail, Phone, Moon, Sun, ShieldCheck, Users, Star, Coffee,
  Building, ShoppingBag, MessageCircle, ArrowRight, CheckCircle2,
  LogOut, UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', title: 'Verified Listings', desc: 'Every property is reviewed and approved by our admin team. No scams, no fake photos.' },
  { icon: Users, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', title: 'Smart Roommate Match', desc: 'Algorithm matches you based on habits, budget, sleep schedule and location.' },
  { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', title: 'Student Marketplace', desc: 'Buy and sell books, furniture, and appliances with fellow students nearby.' },
  { icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', title: 'Community Forum', desc: 'Ask questions, share tips, find study groups — built for students.' },
  { icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Local Essentials', desc: 'Discover cafes, print shops, laundry services, and weekly haats near campus.' },
  { icon: Building, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20', title: 'Landlord Portal', desc: 'List properties, manage tenants, and respond to inquiries in one place.' },
];

const STEPS = [
  { step: '01', title: 'Create your profile', desc: 'Sign up as a student or landlord. Set your location, budget, and habits.' },
  { step: '02', title: 'Browse verified listings', desc: 'Search rooms and flats in Biratnagar, Itahari, and Dharan — all admin-approved.' },
  { step: '03', title: 'Match & connect', desc: 'Get matched with compatible roommates and message property owners directly.' },
  { step: '04', title: 'Move in confidently', desc: 'No scams, no surprises. Your student home is waiting.' },
];

const TESTIMONIALS = [
  { text: "Found my current flatmate through the Smart Match. We have been living together for 6 months — couldn't be better!", name: 'Priya Gurung', course: 'BSc Computing, IIC Biratnagar', initials: 'PG', color: 'bg-pink-500' },
  { text: "The verified listings saved me from so many Facebook scams. Found a clean 2BHK in Itahari within a week.", name: 'Rohan Shrestha', course: 'BBA, Mechi Campus', initials: 'RS', color: 'bg-blue-500' },
  { text: "Sold my old textbooks and bought a second-hand table through the marketplace. Everything in one place!", name: 'Anisha Karki', course: 'BCA, Purwanchal University', initials: 'AK', color: 'bg-green-500' },
];

const STATS = [
  { value: '1,200+', label: 'Students registered' },
  { value: '340+', label: 'Verified listings' },
  { value: '3', label: 'Cities covered' },
  { value: '98%', label: 'Satisfaction rate' },
];

const LOCATIONS = ['Biratnagar', 'Itahari', 'Dharan', 'Sunsari', 'Morang'];

// Destination after login based on role
function dashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'landlord') return '/landlord';
  if (role === 'service_provider') return '/provider';
  return '/dashboard';
}

export default function FrontPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [selectedLocation, setSelectedLocation] = useState('Biratnagar');
  const [searchType, setSearchType] = useState('Rooms');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSearch = () => {
    if (user) navigate(dashboardPath(user.role));
    else navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors duration-300">

      {/* ==========================================
          NAVBAR — auth-aware
      ========================================== */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">

          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Bidhyarthi Ghar</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => user ? navigate(dashboardPath(user.role)) : navigate('/login')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Accommodation
            </button>
            <button onClick={() => user ? navigate(dashboardPath(user.role)) : navigate('/login')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Community
            </button>
            <button onClick={() => user ? navigate(dashboardPath(user.role)) : navigate('/login')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Marketplace
            </button>
          </div>

          {/* Right side — changes based on auth state */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              // LOGGED IN — show avatar + dashboard button + logout
              <>
                <button onClick={() => navigate(dashboardPath(user.role))}
                  className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {userInitials}
                  </div>
                  {user.name.split(' ')[0]}
                </button>
                <button onClick={() => navigate(dashboardPath(user.role))}
                  className="hidden sm:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm items-center gap-1.5 transition-colors">
                  Go to Dashboard <ArrowRight size={14} />
                </button>
                <button onClick={handleLogout}
                  className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              // NOT LOGGED IN — show Login + Sign Up
              <>
                <button onClick={() => navigate('/login')}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Log in
                </button>
                <button onClick={() => navigate('/signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ==========================================
          HERO — search is functional
      ========================================== */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-28 text-center">

          {/* If logged in, personalise the headline */}
          {user ? (
            <>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <CheckCircle2 size={14} /> Welcome back, {user.name.split(' ')[0]}!
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Continue Your Student Journey
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                You're logged in as <span className="font-bold capitalize">{user.role}</span>. Head to your dashboard to manage everything.
              </p>
              <button onClick={() => navigate(dashboardPath(user.role))}
                className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2 text-lg">
                Open Dashboard <ArrowRight size={20} />
              </button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <MapPin size={14} /> Serving Biratnagar, Itahari & Dharan
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Your Second Home,<br />Your Student Community
              </h1>
              <p className="text-lg text-blue-100 mb-10">
                Verified housing, smart roommate matching, local services and student forums — all in one place.
              </p>

              {/* Functional search bar */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
                {/* Type toggle */}
                <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  {['Rooms', 'Roommates', 'Items'].map(t => (
                    <button key={t} onClick={() => setSearchType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${searchType === t ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Location picker */}
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <button onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors">
                  <Search size={16} /> Search
                </button>
              </div>

              <p className="text-blue-200 text-xs mt-4">
                Searching for <span className="font-bold">{searchType}</span> in <span className="font-bold">{selectedLocation}</span> — login to see results
              </p>
            </>
          )}
        </div>
      </section>

      {/* ==========================================
          STATS BAR
      ========================================== */}
      <section className="bg-blue-600 dark:bg-blue-900">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center text-white">
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          FEATURES GRID
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold dark:text-white mb-3">Everything a Student Needs</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">One platform for housing, roommates, marketplace, and community — built for students in Eastern Nepal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title}
                onClick={() => user ? navigate(dashboardPath(user.role)) : navigate('/login')}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all cursor-pointer group">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={f.color} />
                </div>
                <h3 className="font-bold text-lg dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS
      ========================================== */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold dark:text-white mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">From sign-up to move-in in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%-8px)] w-full h-0.5 bg-blue-100 dark:bg-blue-900/50 z-0" />
                )}
                <div className="relative z-10 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-extrabold text-lg mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          TESTIMONIALS
      ========================================== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold dark:text-white mb-3">Trusted by Students</h2>
          <p className="text-gray-500 dark:text-gray-400">What our community says about Bidhyarthi Ghar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex text-yellow-400 mb-4 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic mb-5 flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className={`w-9 h-9 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          CTA BANNER
      ========================================== */}
      {!user && (
        <section className="bg-blue-600 dark:bg-blue-900 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">Ready to find your student home?</h2>
            <p className="text-blue-100 mb-8">Join 1,200+ students already using Bidhyarthi Ghar in Eastern Nepal.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-sm">
                Get Started — It's Free
              </button>
              <button onClick={() => navigate('/login')}
                className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors text-sm">
                Browse Listings
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white"><GraduationCap size={16} /></div>
              <span className="font-bold text-lg dark:text-white">Bidhyarthi Ghar</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs leading-relaxed">
              The ultimate student housing and community platform for Eastern Nepal. Verified, safe, and student-first.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Facebook size={15} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"><Instagram size={15} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-colors"><Twitter size={15} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold dark:text-white mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              {['Find Rooms', 'Roommate Match', 'Marketplace', 'Community Forum', 'Local Services'].map(link => (
                <li key={link}>
                  <button onClick={() => user ? navigate(dashboardPath(user.role)) : navigate('/login')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold dark:text-white mb-4 text-sm">Contact</h3>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5 flex-shrink-0" /> support@bidhyarthighar.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +977 9800000000</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Itahari, Sunsari, Nepal</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 py-5">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
            <span>© 2026 Bidhyarthi Ghar. All rights reserved.</span>
            <div className="flex gap-5">
              <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
              <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
              <button className="hover:text-blue-600 transition-colors">Safety Center</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}