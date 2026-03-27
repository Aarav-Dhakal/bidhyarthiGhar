import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, LogOut, Plus, Users, Star, Moon, Sun, Bell,
  X, CheckCircle2, Clock, Edit, Trash2, MessageSquare,
  LayoutDashboard, Phone, Mail, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = React.lazy(() => import('../components/Messages'));

const initialServices = [
  { id: 1, title: 'Quick Laundry', category: 'Laundry', location: 'Itahari', price: 'Rs. 50/kg', rating: 4.7, status: 'active', bookings: 3, image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80' },
  { id: 2, title: 'Student Print Point', category: 'Printing', location: 'Near IIC Biratnagar', price: 'Rs. 2/page', rating: 4.5, status: 'active', bookings: 1, image: 'https://images.unsplash.com/photo-1612630741022-b29a5a0e9b7b?w=800&q=80' },
];

const initialBookings = [
  { id: 1, customer: 'Aryan Thapa', service: 'Quick Laundry', date: '2026-03-28', status: 'pending', phone: '9800000001', email: 'aryan@bg.com' },
  { id: 2, customer: 'Sita Tamang', service: 'Quick Laundry', date: '2026-03-27', status: 'confirmed', phone: '9800000002', email: 'sita@bg.com' },
];

const statusColors = {
  active:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive:  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const EMPTY_FORM = { title: '', category: 'Laundry', location: '', price: '', image: '', status: 'active' };
const CATEGORIES = ['Laundry', 'Printing', 'Tiffin/Food', 'Transport', 'Tutoring', 'Repair', 'Cleaning', 'Other'];

export default function ServiceProviderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [services, setServices] = useState(initialServices);
  const [bookings, setBookings] = useState(initialBookings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SP';

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setServices([{ ...form, id: Date.now(), rating: 0, bookings: 0, image: form.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' }, ...services]);
    setShowAddModal(false); setForm(EMPTY_FORM);
    showToast('Service listed successfully!');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setServices(services.map(s => s.id === selectedSvc.id ? { ...s, ...form } : s));
    setShowEditModal(false);
    showToast('Service updated!');
  };

  const openEdit = (svc) => { setSelectedSvc(svc); setForm({ ...svc }); setShowEditModal(true); };
  const handleDelete = (id) => { setServices(services.filter(s => s.id !== id)); showToast('Service removed.', 'error'); };
  const updateBooking = (id, status) => { setBookings(b => b.map(x => x.id === id ? { ...x, status } : x)); showToast(`Booking ${status}!`); };

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const navItems = [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'services',  label: 'My Services', icon: Briefcase },
    { id: 'bookings',  label: 'Bookings',  icon: Users, badge: pendingBookings.length },
    { id: 'messages',  label: 'Messages',  icon: MessageSquare },
  ];

  const ServiceForm = ({ onSubmit, label }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Service Title</label>
        <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Quick Laundry Service"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Price</label>
          <input required type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. Rs. 50/kg"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Location</label>
        <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
          placeholder="e.g. Near IIC Biratnagar"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
        <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
          placeholder="https://..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <button type="submit" className="w-full bg-teal-600 text-white p-3 rounded-lg font-bold hover:bg-teal-700 transition-colors">{label}</button>
    </form>
  );

  const renderContent = () => {
    switch (activeTab) {

      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                { label: 'Total Services', value: services.length, color: 'teal', icon: Briefcase },
                { label: 'Active Services', value: services.filter(s => s.status === 'active').length, color: 'green', icon: CheckCircle2 },
                { label: 'Total Bookings', value: bookings.length, color: 'blue', icon: Users },
                { label: 'Pending Bookings', value: pendingBookings.length, color: 'yellow', icon: Clock },
              ].map(s => {
                const Icon = s.icon;
                const cls = {
                  teal:   { bg: 'bg-teal-100 dark:bg-teal-900/30',   text: 'text-teal-600 dark:text-teal-400' },
                  green:  { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
                  blue:   { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-600 dark:text-blue-400' },
                  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
                }[s.color];
                return (
                  <div key={s.label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cls.bg}`}><Icon size={26} className={cls.text} /></div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                      <p className="text-3xl font-bold dark:text-white">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2"><Briefcase size={18} className="text-teal-500" /> My Services</h2>
                <button onClick={() => setActiveTab('services')} className="text-sm text-teal-600 hover:underline">Manage All</button>
              </div>
              {services.length === 0 ? (
                <div className="p-8 text-center"><p className="text-gray-400 text-sm">No services yet. Add your first one!</p></div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {services.map(s => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={s.image} alt={s.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="font-semibold dark:text-white text-sm">{s.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {s.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold dark:text-white">{s.price}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColors[s.status]}`}>{s.status}</span>
                        {s.bookings > 0 && <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{s.bookings} req</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending bookings */}
            {pendingBookings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="font-bold text-lg dark:text-white flex items-center gap-2"><Clock size={18} className="text-yellow-500" /> Pending Bookings</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-sm text-teal-600 hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingBookings.map(b => (
                    <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold dark:text-white text-sm">{b.customer}</p>
                        <p className="text-xs text-gray-400">{b.service} • {b.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateBooking(b.id, 'confirmed')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700">Confirm</button>
                        <button onClick={() => updateBooking(b.id, 'cancelled')} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'services':
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{services.length} services listed</p>
              <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
                <Plus size={18} /> Add Service
              </button>
            </div>
            {services.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-100 dark:border-gray-700">
                <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No services yet.</p>
                <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }}
                  className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-teal-700 transition-colors">Add Your First Service</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold capitalize ${statusColors[s.status]}`}>{s.status}</span>
                      <span className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-xs px-2 py-0.5 rounded-full font-bold dark:text-white">{s.category}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold dark:text-white mb-1">{s.title}</h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-1"><MapPin size={11} /> {s.location}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-teal-600 dark:text-teal-400 font-bold">{s.price}</span>
                        {s.rating > 0 && <span className="flex items-center gap-1 text-xs text-yellow-500"><Star size={11} fill="currentColor" /> {s.rating}</span>}
                      </div>
                      <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={() => openEdit(s)} className="flex-1 flex items-center justify-center gap-1.5 border border-teal-200 text-teal-600 py-2 rounded-lg text-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors font-medium">
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-3 gap-4">
              {['pending', 'confirmed', 'cancelled'].map(s => (
                <div key={s} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <p className={`text-2xl font-bold ${s === 'confirmed' ? 'text-green-600' : s === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {bookings.filter(b => b.status === s).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium capitalize">{s}</p>
                </div>
              ))}
            </div>
            {bookings.map(b => (
              <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {b.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{b.customer}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{b.service} • {b.date}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Phone size={11} />{b.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={11} />{b.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${statusColors[b.status]}`}>{b.status}</span>
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateBooking(b.id, 'confirmed')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700">Confirm</button>
                        <button onClick={() => updateBooking(b.id, 'cancelled')} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200">Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'messages':
        return (
          <React.Suspense fallback={<div className="h-full flex items-center justify-center"><p className="text-gray-400">Loading chat...</p></div>}>
            <Messages />
          </React.Suspense>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-20 shadow-sm">
        <div onClick={() => navigate('/')} className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity border-b border-gray-100 dark:border-gray-700">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white"><Briefcase size={18} /></div>
          <div>
            <p className="font-bold text-sm dark:text-white">Provider Portal</p>
            <p className="text-xs text-gray-400">Bidhyarthi Ghar</p>
          </div>
        </div>
        <div className="m-4 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{userInitials}</div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Service Provider</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium ${activeTab === item.id ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{navItems.find(i => i.id === activeTab)?.label}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Bidhyarthi Ghar — Provider Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Bell size={18} />
              {pendingBookings.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800" />}
            </button>
            <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
              <Plus size={16} /> Add Service
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
      </main>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl dark:text-white">Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <ServiceForm onSubmit={handleAddSubmit} label="Add Service" />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedSvc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl dark:text-white">Edit Service</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <ServiceForm onSubmit={handleEditSubmit} label="Save Changes" />
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <X size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
