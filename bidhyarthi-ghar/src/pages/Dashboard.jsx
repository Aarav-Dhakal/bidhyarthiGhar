import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, ShoppingBag, MessageSquare, Users, LogOut, GraduationCap,
  Bell, MapPin, Search, Plus, Send, Moon, Sun, Star,
  CheckCircle2, Store, Coffee, ExternalLink, CalendarDays, X,
  Tag, Map, UserCircle, Briefcase, MessageCircle, Heart,
  Facebook, Instagram, Twitter, Trash2, ChevronDown, ChevronUp, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Marketplace from '../components/Marketplace';
import RoommateMatch from '../components/RoommateMatch';
import Messages from '../components/Messages';

// ==========================================
// MOCK PROPERTIES
// ==========================================
const mockProperties = [
  { id: 1, type: 'Flat', title: '2BHK Premium Flat', location: 'Kanchanbari, Biratnagar', price: 'Rs. 12,000/mo', rating: 4.8, amenities: ['Kitchen', 'Parking', 'Water'], isCommercial: false, image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80' },
  { id: 2, type: 'Hostel', title: 'Everest Boys Hostel', location: 'Tinkune, Dharan', price: 'Rs. 8,500/mo', rating: 4.2, amenities: ['Food Included', 'Laundry', 'Wi-Fi'], isCommercial: true, mapQuery: 'Everest+Boys+Hostel+Dharan', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80' },
  { id: 3, type: 'Hotel', title: 'Hotel Harrison Palace', location: 'Biratnagar', price: 'Rs. 3,500/night', rating: 4.9, amenities: ['AC', 'Breakfast'], isCommercial: true, mapQuery: 'Hotel+Harrison+Palace+Biratnagar', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  { id: 4, type: 'Room', title: 'Cozy Single Room', location: 'Traffic Chowk, Itahari', price: 'Rs. 4,500/mo', rating: 4.5, amenities: ['Attached Bath', 'Wi-Fi'], isCommercial: false, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
];

// ==========================================
// FORUM DATA
// ==========================================
const FORUM_TAGS = ['All', 'Looking for Room', 'Roommate', 'Marketplace', 'Study', 'General'];

const tagColors = {
  'Looking for Room': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Roommate': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Marketplace': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'Study': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'General': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const initialPosts = [
  {
    id: 1, author: 'Sita Tamang', authorInitials: 'ST', authorColor: 'bg-purple-500',
    tag: 'Looking for Room',
    text: "Urgent! Need a female roommate for a flat in Dharan. Rent is 5k. Anyone??",
    time: '2h ago', likes: ['rohan@bg.com'],
    comments: [{ id: 101, author: 'Rohan Shrestha', authorInitials: 'RS', authorColor: 'bg-blue-500', text: "Check DM, I know someone.", time: '1h ago' }],
    showComments: false,
  },
  {
    id: 2, author: 'Bikash Rai', authorInitials: 'BR', authorColor: 'bg-green-500',
    tag: 'Study',
    text: "Who's up for a study session at library? Covering Data Structures today.",
    time: '5h ago', likes: [], comments: [], showComments: false,
  },
  {
    id: 3, author: 'Priya Gurung', authorInitials: 'PG', authorColor: 'bg-pink-500',
    tag: 'Marketplace',
    text: "Selling my 2nd year BBA books for 800. DM if u want them.",
    time: '1d ago', likes: ['aryan@bg.com', 'sita@bg.com'],
    comments: [
      { id: 201, author: 'Aryan Thapa', authorInitials: 'AT', authorColor: 'bg-orange-500', text: 'Latest edition?', time: '20h ago' },
      { id: 202, author: 'Priya Gurung', authorInitials: 'PG', authorColor: 'bg-pink-500', text: 'Yup, 2024 ones.', time: '18h ago' },
    ],
    showComments: false,
  },
];

// ==========================================
// DASHBOARD
// ==========================================
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('rooms');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New message from Ram Landlord about "2BHK Premium Flat"', time: '2 min ago', read: false, icon: '🏠' },
    { id: 2, text: 'Priya Gurung liked your forum post', time: '15 min ago', read: false, icon: '❤️' },
    { id: 3, text: 'Rohan Shrestha commented: "I know someone near Dharan..."', time: '1 hour ago', read: false, icon: '💬' },
    { id: 4, text: 'New verified listing added in Itahari — check it out!', time: '3 hours ago', read: true, icon: '✅' },
    { id: 5, text: 'Your roommate match score updated — 3 new matches!', time: '1 day ago', read: true, icon: '👥' },
  ]);
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  // Rooms filter state
  const [roomSearch, setRoomSearch] = useState('');
  const [roomType, setRoomType] = useState('All Types');
  const [roomPrice, setRoomPrice] = useState('Any Price');

  // Forum state
  const [posts, setPosts] = useState(initialPosts);
  const [postInput, setPostInput] = useState('');
  const [postTag, setPostTag] = useState('General');
  const [activeForumTag, setActiveForumTag] = useState('All');
  const [commentInputs, setCommentInputs] = useState({});

  const [properties, setProperties] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [chatPartnerId, setChatPartnerId] = useState(null);

  // Load live rooms
  useEffect(() => {
    api.getRooms()
      .then(data => {
        setProperties(data.map(r => ({
          id: r.id,
          landlordId: r.landlord_id,
          type: r.room_type || 'Room',
          title: r.title,
          location: r.location,
          price: `Rs. ${parseFloat(r.price).toLocaleString()}/mo`,
          rating: 4.5, // Mock rating as DB doesn't have it yet
          amenities: r.amenities || [],
          isCommercial: !!r.is_commercial, // Future proofing
          mapQuery: encodeURIComponent(`${r.title} ${r.location}`),
          image: (r.image_urls && r.image_urls[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        })));
      })
      .catch(err => console.error("Failed to load rooms:", err))
      .finally(() => setLoadingRooms(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  // ---- Forum actions ----
  const handlePostSubmit = () => {
    if (!postInput.trim()) return;
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
    setPosts([{
      id: Date.now(),
      author: user?.name || 'Anonymous',
      authorInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
      authorColor: colors[Math.floor(Math.random() * colors.length)],
      tag: postTag, text: postInput.trim(), time: 'Just now',
      likes: [], comments: [], showComments: false, isOwn: true,
    }, ...posts]);
    setPostInput(''); setPostTag('General');
  };

  const handleLike = (postId) => {
    const email = user?.email || 'guest';
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(email);
      return { ...p, likes: liked ? p.likes.filter(e => e !== email) : [...p.likes, email] };
    }));
  };

  const toggleComments = (id) => setPosts(posts.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
  const handleDeletePost = (id) => setPosts(posts.filter(p => p.id !== id));

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    const newComment = {
      id: Date.now(), author: user?.name || 'Anonymous',
      authorInitials: userInitials, authorColor: 'bg-blue-600',
      text, time: 'Just now',
    };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment], showComments: true } : p));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleDeleteComment = (postId, commentId) =>
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));

  const filteredPosts = activeForumTag === 'All' ? posts : posts.filter(p => p.tag === activeForumTag);

  // ==========================================
  // TAB CONTENT
  // ==========================================
  const renderContent = () => {
    switch (activeTab) {

      // ---- ACCOMMODATION ----
      case 'rooms': {
        // Live filtering
        const priceRanges = {
          'Under 5k': p => { const n = parseInt(p.price.replace(/[^0-9]/g, '')); return n < 5000; },
          '5k - 10k': p => { const n = parseInt(p.price.replace(/[^0-9]/g, '')); return n >= 5000 && n <= 10000; },
          'Above 10k': p => { const n = parseInt(p.price.replace(/[^0-9]/g, '')); return n > 10000; },
        };
        const visibleProperties = properties.filter(p => {
          const matchSearch = roomSearch.trim() === '' ||
            p.title.toLowerCase().includes(roomSearch.toLowerCase()) ||
            p.location.toLowerCase().includes(roomSearch.toLowerCase()) ||
            p.type.toLowerCase().includes(roomSearch.toLowerCase());
          const matchType = roomType === 'All Types' || p.type === roomType;
          const matchPrice = roomPrice === 'Any Price' || (priceRanges[roomPrice] && priceRanges[roomPrice](p));
          return matchSearch && matchType && matchPrice;
        });

        return (
          <div className="space-y-6">
            {/* Search + filter bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={roomSearch}
                  onChange={e => setRoomSearch(e.target.value)}
                  placeholder="Search by title, location, type..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none text-sm">
                <option>All Types</option>
                <option>Room</option>
                <option>Flat</option>
                <option>Hostel</option>
                <option>Hotel</option>
              </select>
              <select
                value={roomPrice}
                onChange={e => setRoomPrice(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none text-sm">
                <option>Any Price</option>
                <option>Under 5k</option>
                <option>5k - 10k</option>
                <option>Above 10k</option>
              </select>
            </div>

            {/* Active filter badges */}
            {(roomSearch || roomType !== 'All Types' || roomPrice !== 'Any Price') && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{visibleProperties.length} result{visibleProperties.length !== 1 ? 's' : ''}</span>
                {roomSearch && (
                  <span className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                    "{roomSearch}" <button onClick={() => setRoomSearch('')} className="hover:text-blue-900"><X size={11} /></button>
                  </span>
                )}
                {roomType !== 'All Types' && (
                  <span className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-medium">
                    {roomType} <button onClick={() => setRoomType('All Types')} className="hover:text-purple-900"><X size={11} /></button>
                  </span>
                )}
                {roomPrice !== 'Any Price' && (
                  <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full font-medium">
                    {roomPrice} <button onClick={() => setRoomPrice('Any Price')} className="hover:text-green-900"><X size={11} /></button>
                  </span>
                )}
                <button
                  onClick={() => { setRoomSearch(''); setRoomType('All Types'); setRoomPrice('Any Price'); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            {visibleProperties.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-14 text-center border border-gray-100 dark:border-gray-700">
                <Search size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium mb-1">No properties found</p>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setRoomSearch(''); setRoomType('All Types'); setRoomPrice('Any Price'); }}
                  className="text-sm text-blue-600 hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleProperties.map(p => (
                  <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group flex flex-col">
                    <div className="h-48 relative overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">{p.type}</span>
                      <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-lg font-bold dark:text-white text-sm">{p.price}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1.5">
                        <h3 className="font-bold dark:text-white truncate text-sm">{p.title}</h3>
                        <span className="flex items-center gap-1 text-xs text-yellow-500 flex-shrink-0"><Star size={12} fill="currentColor" /> {p.rating}</span>
                      </div>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-3"><MapPin size={12} /> {p.location}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.amenities.map(a => <span key={a} className="text-[10px] bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">{a}</span>)}
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                        <button onClick={() => { setChatPartnerId(p.landlordId); setActiveTab('messages'); }}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                          <Building size={14} /> Contact
                        </button>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${p.mapQuery}`} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Map size={14} /> Map
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // ---- ROOMMATES — imported component ----
      case 'roommates':
        return <RoommateMatch onConnect={() => setActiveTab('messages')} />;

      // ---- MARKETPLACE — imported component ----
      case 'market':
        return <Marketplace onContactSeller={(id) => { setChatPartnerId(id); setActiveTab('messages'); }} />;

      // ---- LOCAL SERVICES ----
      case 'services':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Quick Laundry', desc: 'Rs. 50/kg • Free Pickup in Itahari', color: 'blue' },
                { title: 'Student Print Point', desc: 'Rs. 2/page • Near IIC College', color: 'green' },
                { title: 'Tiffin Service', desc: 'Rs. 80/meal • Home-cooked daily', color: 'orange' },
              ].map(s => (
                <div key={s.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 bg-${s.color}-100 text-${s.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}><Briefcase size={26} /></div>
                  <h3 className="font-bold dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{s.desc}</p>
                  <button className={`text-${s.color}-600 border border-${s.color}-600 px-4 py-2 rounded-lg w-full text-sm hover:bg-${s.color}-50 transition-colors`}>View Details</button>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- COMMUNITY FORUM ----
      case 'forum':
        return (
          <div className="space-y-5">

            {/* Compose */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{userInitials}</div>
                <div className="flex-1 space-y-3">
                  <textarea value={postInput} onChange={e => setPostInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handlePostSubmit(); }}
                    placeholder="Share something with the student community..."
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm border border-gray-200 dark:border-gray-600" />
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tag:</span>
                      {FORUM_TAGS.filter(t => t !== 'All').map(t => (
                        <button key={t} onClick={() => setPostTag(t)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${postTag === t ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <button onClick={handlePostSubmit} disabled={!postInput.trim()}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                      <Send size={14} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {FORUM_TAGS.map(t => (
                <button key={t} onClick={() => setActiveForumTag(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeForumTag === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'}`}>
                  {t}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-medium">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}{activeForumTag !== 'All' ? ` in "${activeForumTag}"` : ''}
            </p>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <MessageCircle size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No posts yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => {
                  const isLiked = post.likes.includes(user?.email || 'guest');
                  const isOwn = post.author === user?.name;
                  return (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${post.authorColor} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                              {post.authorInitials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm dark:text-white">{post.author}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[post.tag] || tagColors['General']}`}>{post.tag}</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
                            </div>
                          </div>
                          {isOwn && (
                            <button onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{post.text}</p>
                      </div>

                      <div className="px-5 pb-4 flex items-center gap-1 border-t border-gray-50 dark:border-gray-700/50 pt-3">
                        <button onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                          <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
                          {post.likes.length > 0 && <span>{post.likes.length}</span>}
                          <span>{isLiked ? 'Liked' : 'Like'}</span>
                        </button>
                        <button onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MessageCircle size={15} />
                          {post.comments.length > 0 && <span>{post.comments.length}</span>}
                          <span>Comments</span>
                          {post.showComments ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>

                      {post.showComments && (
                        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                          {post.comments.length > 0 && (
                            <div className="px-5 pt-4 space-y-3">
                              {post.comments.map(c => (
                                <div key={c.id} className="flex items-start gap-3 group">
                                  <div className={`w-8 h-8 rounded-full ${c.authorColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5`}>{c.authorInitials}</div>
                                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs dark:text-white">{c.author}</span>
                                        <span className="text-xs text-gray-400">{c.time}</span>
                                      </div>
                                      {c.author === user?.name && (
                                        <button onClick={() => handleDeleteComment(post.id, c.id)}
                                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all">
                                          <Trash2 size={11} />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-sm dark:text-gray-300 mt-0.5 leading-relaxed">{c.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="px-5 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">{userInitials}</div>
                            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                              <input type="text" value={commentInputs[post.id] || ''}
                                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                placeholder="Write a comment..."
                                className="flex-1 bg-transparent outline-none text-sm dark:text-white placeholder-gray-400" />
                              <button onClick={() => handleAddComment(post.id)} disabled={!(commentInputs[post.id] || '').trim()}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <Send size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      // ---- MESSAGES — imported component ----
      case 'messages':
        return (
          <React.Suspense fallback={<div className="h-full flex items-center justify-center"><p className="text-gray-400">Loading chat...</p></div>}>
            <Messages initialPartnerId={chatPartnerId} onPartnerSelect={() => setChatPartnerId(null)} />
          </React.Suspense>
        );

      default: return null;
    }
  };

  const navItems = [
    { id: 'rooms', label: 'Accommodation', icon: Home },
    { id: 'roommates', label: 'Roommates', icon: Users },
    { id: 'market', label: 'Marketplace', icon: ShoppingBag },
    { id: 'services', label: 'Local Services', icon: Briefcase },
    { id: 'forum', label: 'Community Forum', icon: MessageCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-20 shadow-sm">
        <div onClick={() => navigate('/')} className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow flex items-center justify-center text-white"><GraduationCap size={18} /></div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">Bidhyarthi Ghar</span>
        </div>

        <div className="mx-4 mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{userInitials}</div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">{user?.role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Icon size={18} />{item.label}
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

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{navItems.find(i => i.id === activeTab)?.label}</h1>
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

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-sm dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => markRead(n.id)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}>
                        <span className="text-lg mt-0.5 flex-shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-800 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                            {n.text}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 text-center">
                    <span className="text-xs text-gray-400">You're all caught up!</span>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors">
              <UserCircle size={16} /> {user?.name?.split(' ')[0]}
            </button>
          </div>
        </header>

        {/* Content — full width, no centering constraints */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 flex-1">
            {renderContent()}
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-blue-600" />
                <span className="font-bold text-gray-900 dark:text-gray-200">Bidhyarthi Ghar</span> © 2026
              </div>
              <div className="flex gap-5 font-medium">
                <a href="#" className="hover:text-blue-600 transition-colors">Safety Center</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
              </div>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={16} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram size={16} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={16} /></a>
              </div>
            </div>
          </footer>
        </div>

        {/* Profile modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg dark:text-white">Edit Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={18} /></button>
              </div>
              <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{userInitials}</div>
                <div>
                  <p className="font-bold dark:text-white">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium capitalize">{user?.role}</span>
                </div>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Bio</label>
                  <textarea className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" rows="3" placeholder="I am a BBA student looking for..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Monthly Budget</label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>Under Rs. 3,000</option><option>Rs. 3,000 - 5,000</option><option>Rs. 5,000 - 8,000</option>
                  </select>
                </div>
                <button type="button" onClick={() => setShowProfileModal(false)} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">Save Profile</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}