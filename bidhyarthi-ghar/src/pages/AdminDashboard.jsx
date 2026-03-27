import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, LogOut, LayoutDashboard, Users, Building,
  Flag, Bell, Moon, Sun, Search, Check, X,
  Clock, CheckCircle2, XCircle, Ban, UserCheck, Trash2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockUsers = [
  { id: 1, name: 'Aryan Thapa', email: 'aryan@bg.com', role: 'student', status: 'active', joined: '2026-01-10', location: 'Itahari' },
  { id: 2, name: 'Sita Tamang', email: 'sita@bg.com', role: 'student', status: 'active', joined: '2026-01-15', location: 'Dharan' },
  { id: 3, name: 'Ram Landlord', email: 'owner@bg.com', role: 'landlord', status: 'active', joined: '2025-12-01', location: 'Biratnagar' },
  { id: 4, name: 'Bikash Rai', email: 'bikash@bg.com', role: 'student', status: 'banned', joined: '2026-02-01', location: 'Biratnagar' },
  { id: 5, name: 'Priya Gurung', email: 'priya@bg.com', role: 'landlord', status: 'pending', joined: '2026-03-20', location: 'Dharan' },
  { id: 6, name: 'Rohan Shrestha', email: 'rohan@bg.com', role: 'student', status: 'active', joined: '2026-02-14', location: 'Itahari' },
];

const mockListings = [
  { id: 1, title: '2BHK Premium Flat', owner: 'Ram Landlord', location: 'Kanchanbari, Biratnagar', price: 'Rs. 12,000/mo', status: 'approved', type: 'Flat', submitted: '2026-03-01' },
  { id: 2, title: 'Everest Boys Hostel', owner: 'Ram Landlord', location: 'Tinkune, Dharan', price: 'Rs. 8,500/mo', status: 'approved', type: 'Hostel', submitted: '2026-02-20' },
  { id: 3, title: 'Studio Near IIC', owner: 'Priya Gurung', location: 'Itahari', price: 'Rs. 6,000/mo', status: 'pending', type: 'Room', submitted: '2026-03-22' },
  { id: 4, title: 'Girls PG Biratnagar', owner: 'Priya Gurung', location: 'Biratnagar', price: 'Rs. 5,500/mo', status: 'pending', type: 'Hostel', submitted: '2026-03-23' },
  { id: 5, title: 'Shared Flat Dharan', owner: 'Ram Landlord', location: 'Dharan', price: 'Rs. 3,500/mo', status: 'rejected', type: 'Flat', submitted: '2026-03-10' },
];

const mockReports = [
  { id: 1, type: 'Listing', target: '2BHK Flat - Fake Photos', reporter: 'Aryan Thapa', reason: 'Misleading images', date: '2026-03-24', status: 'open' },
  { id: 2, type: 'User', target: 'Bikash Rai', reporter: 'Sita Tamang', reason: 'Harassment in messages', date: '2026-03-23', status: 'resolved' },
  { id: 3, type: 'Forum', target: 'Post: "Free rooms scam"', reporter: 'Rohan Shrestha', reason: 'Spam / Scam content', date: '2026-03-22', status: 'open' },
  { id: 4, type: 'Listing', target: 'Hotel near Bus Park', reporter: 'Priya Gurung', reason: 'Wrong location listed', date: '2026-03-21', status: 'open' },
];

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  open: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  resolved: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const roleColors = {
  student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  landlord: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [users, setUsers] = useState(mockUsers);
  const [listings, setListings] = useState(mockListings);
  const [reports, setReports] = useState(mockReports);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
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

  // User actions
  const banUser = (id) => { setUsers(u => u.map(x => x.id === id ? { ...x, status: 'banned' } : x)); showToast('User banned.', 'error'); };
  const unbanUser = (id) => { setUsers(u => u.map(x => x.id === id ? { ...x, status: 'active' } : x)); showToast('User reinstated.'); };
  const deleteUser = (id) => { setUsers(u => u.filter(x => x.id !== id)); showToast('User deleted.', 'error'); };

  // Listing actions
  const approveListing = (id) => { setListings(l => l.map(x => x.id === id ? { ...x, status: 'approved' } : x)); showToast('Listing approved!'); };
  const rejectListing = (id) => { setListings(l => l.map(x => x.id === id ? { ...x, status: 'rejected' } : x)); showToast('Listing rejected.', 'error'); };
  const resetListing = (id) => { setListings(l => l.map(x => x.id === id ? { ...x, status: 'pending' } : x)); showToast('Reset to pending.'); };

  // Report actions
  const resolveReport = (id) => { setReports(r => r.map(x => x.id === id ? { ...x, status: 'resolved' } : x)); showToast('Report resolved.'); };
  const dismissReport = (id) => { setReports(r => r.filter(x => x.id !== id)); showToast('Report dismissed.'); };

  // All counts derived from live state
  const pendingListings = listings.filter(l => l.status === 'pending');
  const openReports = reports.filter(r => r.status === 'open');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'listings', label: 'Listings', icon: Building, badge: pendingListings.length },
    { id: 'reports', label: 'Reports', icon: Flag, badge: openReports.length },
  ];

  const renderContent = () => {
    switch (activeTab) {

      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats — 100% live from state */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
                { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: UserCheck, color: 'green' },
                { label: 'Pending Listings', value: pendingListings.length, icon: Clock, color: 'yellow' },
                { label: 'Open Reports', value: openReports.length, icon: Flag, color: 'red' },
              ].map(s => {
                const Icon = s.icon;
                const cls = {
                  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
                  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
                  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
                  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
                }[s.color];
                return (
                  <div key={s.label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cls.bg}`}>
                      <Icon size={26} className={cls.text} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                      <p className="text-3xl font-bold dark:text-white">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pending approvals — with inline actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <Clock size={18} className="text-yellow-500" /> Pending Approvals
                  {pendingListings.length > 0 && <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold">{pendingListings.length}</span>}
                </h2>
                <button onClick={() => setActiveTab('listings')} className="text-sm text-blue-600 hover:underline">View All</button>
              </div>
              {pendingListings.length === 0 ? (
                <div className="p-8 text-center"><CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" /><p className="text-gray-400 text-sm">No pending listings!</p></div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingListings.map(l => (
                    <div key={l.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-semibold dark:text-white text-sm">{l.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{l.owner} • {l.location} • {l.price}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveListing(l.id)} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"><Check size={13} /> Approve</button>
                        <button onClick={() => rejectListing(l.id)} className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"><X size={13} /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Open reports — with inline actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                  <Flag size={18} className="text-red-500" /> Open Reports
                  {openReports.length > 0 && <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">{openReports.length}</span>}
                </h2>
                <button onClick={() => setActiveTab('reports')} className="text-sm text-blue-600 hover:underline">View All</button>
              </div>
              {openReports.length === 0 ? (
                <div className="p-8 text-center"><CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" /><p className="text-gray-400 text-sm">No open reports.</p></div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {openReports.map(r => (
                    <div key={r.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-semibold dark:text-white text-sm">{r.target}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{r.reason} • Reported by {r.reporter}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors.open}`}>{r.type}</span>
                        <button onClick={() => resolveReport(r.id)} className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"><CheckCircle2 size={12} /> Resolve</button>
                        <button onClick={() => dismissReport(r.id)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"><X size={12} /> Dismiss</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-5">
            {/* Live user breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total', value: users.length, color: 'text-gray-800 dark:text-white' },
                { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
                { label: 'Banned', value: users.filter(u => u.status === 'banned').length, color: 'text-red-600' },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} type="text" placeholder="Search by name or email..."
                  className="w-full pl-9 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg text-sm outline-none">
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="landlord">Landlords</option>
              </select>
              <span className="text-sm text-gray-400">{filteredUsers.length} shown</span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">User</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Location</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold dark:text-white">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${roleColors[u.role] || ''}`}>{u.role}</span></td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{u.location}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{u.joined}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColors[u.status]}`}>{u.status}</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {u.status === 'banned'
                              ? <button onClick={() => unbanUser(u.id)} title="Unban" className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"><UserCheck size={15} /></button>
                              : <button onClick={() => banUser(u.id)} title="Ban" className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"><Ban size={15} /></button>
                            }
                            <button onClick={() => deleteUser(u.id)} title="Delete" className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-gray-400 py-10 text-sm">No users match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {['pending', 'approved', 'rejected'].map(s => (
                <div key={s} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <p className={`text-2xl font-bold ${s === 'approved' ? 'text-green-600' : s === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {listings.filter(l => l.status === s).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium capitalize">{s}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Listing</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Owner</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Submitted</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {listings.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold dark:text-white">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.location}</p>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{l.owner}</td>
                        <td className="p-4"><span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full font-bold">{l.type}</span></td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{l.price}</td>
                        <td className="p-4 text-gray-400 text-xs">{l.submitted}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColors[l.status]}`}>{l.status}</span></td>
                        <td className="p-4">
                          {l.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button onClick={() => approveListing(l.id)} className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"><Check size={13} /> Approve</button>
                              <button onClick={() => rejectListing(l.id)} className="flex items-center gap-1 bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"><X size={13} /> Reject</button>
                            </div>
                          ) : (
                            <button onClick={() => resetListing(l.id)} className="flex items-center gap-1 text-gray-400 text-xs hover:text-blue-600 transition-colors"><RefreshCw size={13} /> Reset</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-2xl font-bold text-orange-600">{openReports.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Open</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Resolved</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Reported</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Reason</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Reporter</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {reports.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4 font-semibold dark:text-white max-w-[160px] truncate">{r.target}</td>
                        <td className="p-4"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-bold">{r.type}</span></td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{r.reason}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{r.reporter}</td>
                        <td className="p-4 text-gray-400 text-xs">{r.date}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${statusColors[r.status]}`}>{r.status}</span></td>
                        <td className="p-4">
                          {r.status === 'open' ? (
                            <div className="flex gap-2">
                              <button onClick={() => resolveReport(r.id)} className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"><CheckCircle2 size={13} /> Resolve</button>
                              <button onClick={() => dismissReport(r.id)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"><X size={13} /> Dismiss</button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {reports.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-gray-400 py-10 text-sm">No reports on record.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col z-20 shadow-lg">
        <div onClick={() => navigate('/')} className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity border-b border-gray-700">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><ShieldCheck size={18} /></div>
          <div>
            <p className="font-bold text-sm">Admin Panel</p>
            <p className="text-xs text-gray-400">Bidhyarthi Ghar</p>
          </div>
        </div>
        <div className="m-4 p-3 bg-gray-800 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-red-400 font-medium">Super Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium ${activeTab === item.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors text-sm font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{navItems.find(i => i.id === activeTab)?.label}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Bidhyarthi Ghar — Admin Control Center</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Bell size={18} />
              {(pendingListings.length + openReports.length) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
              )}
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}