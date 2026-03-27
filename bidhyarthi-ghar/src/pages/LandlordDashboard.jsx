import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building, LogOut, Plus, Users, MapPin, Eye, CheckCircle, XCircle,
  LayoutDashboard, Moon, Sun, Bell, X, MessageSquare,
  CheckCircle2, Clock, Edit, Trash2, Phone, Mail, Upload, Image, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Messages = React.lazy(() => import('../components/Messages'));

// initialProperties removed — loaded from database via API

const initialRequests = [
  {
    id: 1, name: 'Aryan Thapa', course: 'BBA Student', property: '2BHK Premium Flat',
    propertyId: 1, verified: true, status: 'pending',
    bio: 'Non-smoker, early riser, looking for long-term stay.',
    phone: '9800000001', email: 'aryan@bg.com',
  },
];

const initialMessages = [
  { id: 1, from: 'Rohan Shrestha', property: 'Everest Boys Hostel', text: 'Is the hostel still available for next month?', time: '2 hrs ago', read: false },
  { id: 2, from: 'Sita Tamang', property: '2BHK Premium Flat', text: 'Can I schedule a visit this weekend?', time: '1 day ago', read: true },
];

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const EMPTY_FORM = { title: '', type: 'Room', location: '', address: '', price: '', description: '', amenities: '', image: '', status: 'pending' };

const NOTIFS = [
  { id: 1, text: 'Aryan Thapa sent a new rental request for "2BHK Premium Flat"', time: '5 min ago', read: false, icon: '🏠' },
  { id: 2, text: 'Sita Tamang wants to schedule a visit this weekend', time: '1 hour ago', read: false, icon: '📅' },
  { id: 3, text: 'Your listing "Everest Boys Hostel" was approved by admin', time: '3 hours ago', read: false, icon: '✅' },
  { id: 4, text: 'Rohan Shrestha sent you a message about the flat', time: '1 day ago', read: true, icon: '💬' },
];

// Defined OUTSIDE LandlordDashboard so React gives it a stable identity.
// If it were inside, every keystroke would cause React to unmount + remount
// the entire form, making inputs lose focus after each character.
function PropertyForm({ form, setForm, handleImageFile, onSubmit, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Title</label>
          <input required type="text" placeholder="e.g. Cozy Room in Itahari" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Room</option><option>Flat</option><option>Hostel</option><option>Hotel</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Price (Rs./mo)</label>
          <input required type="number" placeholder="e.g. 5000" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">City/Area</label>
          <input required type="text" placeholder="e.g. Itahari, Sunsari" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Precise Address</label>
          <input required type="text" placeholder="e.g. Near Bus Park, Ward 4" value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
          <textarea placeholder="Tell students more about the property..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Amenities <span className="text-gray-400 font-normal">(comma separated)</span></label>
          <input type="text" placeholder="e.g. Wi-Fi, Kitchen, Parking" value={form.amenities}
            onChange={e => setForm({ ...form, amenities: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {/* Image upload from device */}
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Property Photo</label>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-700/50 overflow-hidden relative">
            {form.image ? (
              <>
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold flex items-center gap-1"><Upload size={13} /> Change photo</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Image size={28} />
                <span className="text-sm font-medium">Click to upload photo</span>
                <span className="text-xs">JPG, PNG, WEBP up to 10MB</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          </label>
        </div>
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">{submitLabel}</button>
    </form>
  );
}

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [requests, setRequests] = useState(initialRequests);
  const [messages, setMessages] = useState(initialMessages);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFS);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllNotifsRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markNotifRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  // Image file picker
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // Load landlord's rooms from DB on mount
  useEffect(() => {
    api.getMyRooms()
      .then(rooms => {
        setProperties(rooms.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          address: r.address || '',
          type: r.room_type || 'Room',
          location: r.location,
          price: parseFloat(r.price),
          status: r.status || 'pending',
          requests: 0,
          amenities: r.amenities || [],
          image: (r.image_urls && r.image_urls[0]) || 'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80',
          listed: r.created_at ? r.created_at.split('T')[0] : '',
        })));
      })
      .catch(() => {})
      .finally(() => setPropertiesLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // Property actions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const amenitiesArr = form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
    const imageUrls = form.image ? [form.image] : [];
    try {
      const newRoom = await api.createRoom({
        title: form.title,
        description: form.description || '',
        price: parseFloat(form.price),
        location: form.location,
        address: form.address || '',
        room_type: form.type?.toLowerCase() || 'room',
        amenities: amenitiesArr,
        image_urls: imageUrls,
      });
      setProperties(prev => [{
        id: newRoom.id,
        title: newRoom.title,
        type: newRoom.room_type || 'Room',
        location: newRoom.location,
        price: parseFloat(newRoom.price),
        status: newRoom.status || 'pending',
        requests: 0,
        amenities: newRoom.amenities || [],
        image: (newRoom.image_urls && newRoom.image_urls[0]) || 'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80',
        listed: newRoom.created_at ? newRoom.created_at.split('T')[0] : '',
      }, ...prev]);
      setShowAddModal(false);
      setForm(EMPTY_FORM);
      showToast('Listing is now live!');
    } catch (err) {
      showToast(err.message || 'Failed to add listing.', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const amenitiesArr = form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
    const imageUrls = form.image ? [form.image] : [];
    try {
      await api.updateRoom(selectedProp.id, {
        title: form.title,
        description: form.description || '',
        price: parseFloat(form.price),
        location: form.location,
        address: form.address || '',
        room_type: form.type?.toLowerCase() || 'room',
        amenities: amenitiesArr,
        image_urls: imageUrls,
      });
      setProperties(prev => prev.map(p => p.id === selectedProp.id
        ? { ...p, title: form.title, type: form.type, location: form.location, address: form.address,
            price: parseFloat(form.price), description: form.description, amenities: amenitiesArr,
            image: imageUrls[0] || p.image }
        : p
      ));
      setShowEditModal(false);
      showToast('Listing updated!');
    } catch (err) {
      showToast(err.message || 'Failed to update listing.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteRoom(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      showToast('Listing removed.', 'error');
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const openEdit = (prop) => {
    setSelectedProp(prop);
    setForm({ ...prop, amenities: prop.amenities.join(', ') });
    setShowEditModal(true);
  };

  // Request actions
  const acceptRequest = (id) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: 'accepted' } : x));
    // Decrement requests count on the linked property
    const req = requests.find(r => r.id === id);
    if (req) setProperties(p => p.map(x => x.id === req.propertyId ? { ...x, requests: Math.max(0, x.requests - 1) } : x));
    showToast('Tenant request accepted!');
  };

  const rejectRequest = (id) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: 'rejected' } : x));
    const req = requests.find(r => r.id === id);
    if (req) setProperties(p => p.map(x => x.id === req.propertyId ? { ...x, requests: Math.max(0, x.requests - 1) } : x));
    showToast('Request rejected.', 'error');
  };

  const markRead = (id) => setMessages(m => m.map(x => x.id === id ? { ...x, read: true } : x));

  // Derived counts
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const unreadMessages = messages.filter(m => !m.read);
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'L';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'My Properties', icon: Building },
    { id: 'requests', label: 'Tenant Requests', icon: Users, badge: pendingRequests.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessages.length },
  ];

  // PropertyForm is defined OUTSIDE this component (see below) to keep a stable
  // component identity across re-renders — prevents inputs from losing focus.

  const renderContent = () => {
    switch (activeTab) {

      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats — all live from state */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                { label: 'Total Listings', value: properties.length, color: 'indigo', icon: Building },
                { label: 'Active', value: properties.filter(p => p.status === 'active').length, color: 'green', icon: CheckCircle2 },
                { label: 'Pending Approval', value: properties.filter(p => p.status === 'pending').length, color: 'yellow', icon: Clock },
                { label: 'Open Requests', value: pendingRequests.length, color: 'blue', icon: Users },
              ].map(s => {
                const Icon = s.icon;
                const cls = {
                  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
                  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
                  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
                  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
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

            {/* Recent listings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2"><Building size={18} className="text-indigo-500" /> My Listings</h2>
                <button onClick={() => setActiveTab('properties')} className="text-sm text-indigo-600 hover:underline">Manage All</button>
              </div>
              {properties.length === 0 ? (
                <div className="p-8 text-center"><p className="text-gray-400 text-sm">No listings yet. Add your first one!</p></div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {properties.map(p => (
                    <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="font-semibold dark:text-white text-sm">{p.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {p.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold dark:text-white">Rs. {p.price.toLocaleString()}/mo</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColors[p.status]}`}>{p.status}</span>
                        {p.requests > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{p.requests} req</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="font-bold text-lg dark:text-white flex items-center gap-2"><Users size={18} className="text-blue-500" /> Pending Tenant Requests</h2>
                  <button onClick={() => setActiveTab('requests')} className="text-sm text-indigo-600 hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingRequests.map(r => (
                    <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold dark:text-white text-sm">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.course} • {r.property}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => acceptRequest(r.id)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><CheckCircle size={16} /></button>
                        <button onClick={() => rejectRequest(r.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><XCircle size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unread messages */}
            {unreadMessages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="font-bold text-lg dark:text-white flex items-center gap-2"><MessageSquare size={18} className="text-green-500" /> Unread Messages</h2>
                  <button onClick={() => setActiveTab('messages')} className="text-sm text-indigo-600 hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {unreadMessages.map(m => (
                    <div key={m.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold dark:text-white text-sm">{m.from} <span className="text-xs text-gray-400">re: {m.property}</span></p>
                        <p className="text-xs text-gray-400 truncate">{m.text}</p>
                      </div>
                      <button onClick={() => markRead(m.id)} className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors font-medium flex-shrink-0">Mark Read</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{properties.length} listings total</p>
              <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                <Plus size={18} /> Add Listing
              </button>
            </div>
            {properties.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-100 dark:border-gray-700">
                <Building size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No listings yet.</p>
                <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Add Your First Listing</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(p => (
                  <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold capitalize ${statusColors[p.status]}`}>{p.status}</span>
                      {p.requests > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{p.requests} Request</span>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg dark:text-white">{p.title}</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">{p.type}</span>
                      </div>
                      <p className="text-gray-400 text-sm flex items-center gap-1 mb-3"><MapPin size={13} /> {p.location}</p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-3">Rs. {p.price.toLocaleString()}/mo</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.amenities.map(a => <span key={a} className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">{a}</span>)}
                      </div>
                      {/* Only show request count — no fake views */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-center mb-4">
                        <p className="font-bold text-base dark:text-white">{p.requests}</p>
                        <p className="text-gray-400 text-xs">Pending Requests</p>
                      </div>
                      <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={() => { setSelectedProp(p); setShowViewModal(true); }} className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"><Eye size={15} /> View</button>
                        <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 border border-indigo-200 text-indigo-600 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"><Edit size={15} /> Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-3 gap-4">
              {['pending', 'accepted', 'rejected'].map(s => (
                <div key={s} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <p className={`text-2xl font-bold ${s === 'accepted' ? 'text-green-600' : s === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {requests.filter(r => r.status === s).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium capitalize">{s}</p>
                </div>
              ))}
            </div>
            {requests.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <Users size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No tenant requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(r => (
                  <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {r.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold dark:text-white">{r.name}</h3>
                        {r.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle2 size={11} /> ID Verified</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{r.course} • Requested: <span className="font-medium text-gray-700 dark:text-gray-200">{r.property}</span></p>
                      <p className="text-sm text-gray-400 mt-1 italic">"{r.bio}"</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setSelectedReq(r); setShowReqModal(true); }} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="View Profile"><Eye size={17} /></button>
                      {r.status === 'pending' && <>
                        <button onClick={() => acceptRequest(r.id)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><CheckCircle size={17} /></button>
                        <button onClick={() => rejectRequest(r.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><XCircle size={17} /></button>
                      </>}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Building size={18} /></div>
          <div>
            <p className="font-bold text-sm dark:text-white">Owner Portal</p>
            <p className="text-xs text-gray-400">Bidhyarthi Ghar</p>
          </div>
        </div>
        <div className="m-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{userInitials}</div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Landlord</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium ${activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
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
            <p className="text-xs text-gray-400 mt-0.5">Bidhyarthi Ghar — Owner Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-800 px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-sm dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotifsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => markNotifRead(n.id)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <span className="text-lg mt-0.5 flex-shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-800 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 text-center">
                    <span className="text-xs text-gray-400">You're all caught up!</span>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={16} /> Add Listing
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
              <h3 className="font-bold text-xl dark:text-white">Add New Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle size={14} /> Your listing will go live immediately after submission.
            </p>
            <PropertyForm form={form} setForm={setForm} handleImageFile={handleImageFile} onSubmit={handleAddSubmit} submitLabel="Submit for Approval" />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedProp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl dark:text-white">Edit Listing</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <PropertyForm form={form} setForm={setForm} handleImageFile={handleImageFile} onSubmit={handleEditSubmit} submitLabel="Save Changes" />
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedProp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedProp.image} alt={selectedProp.title} className="w-full h-52 object-cover" />
              <button onClick={() => setShowViewModal(false)} className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"><X size={18} /></button>
              <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold capitalize ${statusColors[selectedProp.status]}`}>{selectedProp.status}</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl dark:text-white">{selectedProp.title}</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{selectedProp.type}</span>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-1 mb-3"><MapPin size={13} /> {selectedProp.location}</p>
              <p className="text-indigo-600 font-bold text-xl mb-4">Rs. {selectedProp.price.toLocaleString()}/mo</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedProp.amenities.map(a => <span key={a} className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">{a}</span>)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  <p className="font-bold text-lg dark:text-white">{selectedProp.requests}</p>
                  <p className="text-gray-400 text-xs">Pending Requests</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  <p className="font-bold text-sm dark:text-white">{selectedProp.listed}</p>
                  <p className="text-gray-400 text-xs">Listed On</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TENANT PROFILE MODAL */}
      {showReqModal && selectedReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl dark:text-white">Tenant Profile</h3>
              <button onClick={() => setShowReqModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
                {selectedReq.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-lg dark:text-white">{selectedReq.name}</p>
                  {selectedReq.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle2 size={11} /> Verified</span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedReq.course}</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm"><Mail size={15} className="text-gray-400" /><span className="dark:text-gray-200">{selectedReq.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Phone size={15} className="text-gray-400" /><span className="dark:text-gray-200">{selectedReq.phone}</span></div>
              <div className="flex items-center gap-3 text-sm"><Building size={15} className="text-gray-400" /><span className="dark:text-gray-200">Requested: {selectedReq.property}</span></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-5">"{selectedReq.bio}"</p>
            {selectedReq.status === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => { acceptRequest(selectedReq.id); setShowReqModal(false); }} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><CheckCircle size={16} /> Accept</button>
                <button onClick={() => { rejectRequest(selectedReq.id); setShowReqModal(false); }} className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-lg font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"><XCircle size={16} /> Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}