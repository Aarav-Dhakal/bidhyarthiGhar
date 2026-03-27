import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Tag, Plus, X, ShoppingCart, Store, Coffee,
  ExternalLink, CalendarDays, Trash2, MessageSquare, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

// ==========================================
// SEED DATA (initial state only — all changes are live)
// ==========================================
const seedItems = [
  {
    id: 1,
    title: 'Physics Book',
    category: 'Books',
    price: 450,
    condition: 'Good',
    location: 'Itahari',
    seller: 'Rohan Shrestha',
    sellerEmail: 'rohan@bg.com',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
    postedAt: '2d ago',
  },
  {
    id: 2,
    title: 'Induction Stove',
    category: 'Household',
    price: 1500,
    condition: 'Like New',
    location: 'Biratnagar',
    seller: 'Sita Tamang',
    sellerEmail: 'sita@bg.com',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
    postedAt: '3d ago',
  },
  {
    id: 3,
    title: 'Study Table',
    category: 'Furniture',
    price: 2500,
    condition: 'Used',
    location: 'Dharan',
    seller: 'Bikash Rai',
    sellerEmail: 'bikash@bg.com',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80',
    postedAt: '5d ago',
  },
];

const hatiyaMarkets = [
  { id: 1, name: 'Itahari Haat Bazar', day: 'Wednesdays & Sundays', location: 'Main Chowk, Itahari', desc: 'Fresh vegetables, local spices, and cheap household plastic items.' },
  { id: 2, name: 'Biratnagar Gudri Market', day: 'Open Daily (Morning)', location: 'Gudri, Biratnagar', desc: 'Wholesale fresh produce, local dairy, and meat.' },
  { id: 3, name: 'Sundar Dulari Haat', day: 'Tuesdays', location: 'Sundar Dulari Center', desc: 'Local farming produce, clothing stalls, and street food.' },
  { id: 4, name: 'Bhanu Chowk Market', day: 'Open Daily', location: 'Dharan', desc: 'Local fruits, imports, and thrift clothing.' },
];

const localPlaces = [
  { id: 1, name: 'Kira Cafe & Roastery', type: 'Cafe', location: 'Itahari', mapQuery: 'Kira+Cafe+Itahari', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80' },
  { id: 2, name: 'BBQ Biratnagar', type: 'Restaurant', location: 'Biratnagar', mapQuery: 'BBQ+Biratnagar', img: 'https://images.unsplash.com/photo-1544025162-8325a74a1cb2?w=500&q=80' },
  { id: 3, name: 'Bagar Kot', type: 'Hangout / Food', location: 'Dharan', mapQuery: 'Bagar+Kot+Dharan', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80' },
];

const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Household', 'Food/Groceries', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Used'];

const conditionColors = {
  'New': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Like New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Used': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const EMPTY_FORM = { title: '', price: '', category: 'Books', condition: 'Used', location: '', description: '' };

// ==========================================
// MARKETPLACE COMPONENT
// ==========================================
const Marketplace = ({ onContactSeller }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [newItem, setNewItem] = useState(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toast, setToast] = useState(null);

  // Load items from database
  useEffect(() => {
    api.getMarketplace()
      .then(data => {
        setItems(data.map(i => ({
          id: i.id,
          sellerId: i.seller_id,
          title: i.title,
          category: i.category || 'Other',
          price: parseFloat(i.price),
          condition: i.condition || 'Used',
          location: i.location || 'Unknown',
          seller: i.seller_name || 'Anonymous',
          image: (i.image_urls && i.image_urls[0]) || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80',
          postedAt: i.created_at ? i.created_at.split('T')[0] : 'Recently',
          description: i.description || ''
        })));
      })
      .catch(err => console.error("Marketplace fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Image file picker
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewItem(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ---- Add item ----
  const handleSellSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createItem({
        title: newItem.title,
        description: newItem.description || '',
        price: parseFloat(newItem.price),
        category: newItem.category,
        condition: newItem.condition.toLowerCase(),
        image_urls: newItem.image ? [newItem.image] : []
      });

      setItems([ {
        id: created.id,
        title: created.title,
        category: created.category,
        price: parseFloat(created.price),
        condition: created.condition,
        location: created.location || newItem.location,
        seller: user?.name || 'You',
        sellerEmail: user?.email,
        image: (created.image_urls && created.image_urls[0]) || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80',
        postedAt: 'Just now',
        description: created.description
      }, ...items]);
      
      setShowSellModal(false);
      setNewItem(EMPTY_FORM);
      showToast('Item listed successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to list item.', 'error');
    }
  };

  // ---- Delete item (own listings only) ----
  const handleDelete = async (id) => {
    try {
      await api.deleteItem(id);
      setItems(items.filter(i => i.id !== id));
      setShowDetailModal(null);
      showToast('Listing removed.', 'error');
    } catch (err) {
      showToast(err.message || 'Failed to remove item.', 'error');
    }
  };

  // ---- Filtered items (live) ----
  const filteredItems = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const myListings = items.filter(i => i.sellerEmail === user?.email);
  const otherItems = filteredItems.filter(i => i.sellerEmail !== user?.email);
  const displayItems = filteredItems; // show all in the grid

  return (
    <div className="space-y-5 relative">

      {/* ---- Tab bar ---- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'items', label: 'Student Items', icon: <ShoppingCart size={17} /> },
            { id: 'hatiya', label: 'Local Hatiya', icon: <Store size={17} /> },
            { id: 'places', label: 'Cafes & Food', icon: <Coffee size={17} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        {activeTab === 'items' && (
          <button onClick={() => setShowSellModal(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-sm text-sm whitespace-nowrap">
            <Plus size={18} /> Sell an Item
          </button>
        )}
      </div>

      {/* ==========================================
          TAB 1: STUDENT ITEMS
      ========================================== */}
      {activeTab === 'items' && (
        <div className="space-y-5">

          {/* Search + filter bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search items, location, seller..."
                className="w-full pl-9 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* My listings banner (if any) */}
          {myListings.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                You have <span className="font-bold">{myListings.length}</span> active listing{myListings.length > 1 ? 's' : ''}
              </p>
              <button onClick={() => setCategoryFilter('All')} className="text-xs text-blue-600 dark:text-blue-400 underline">View all</button>
            </div>
          )}

          {/* Results count */}
          <p className="text-xs text-gray-400 font-medium">
            {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
            {categoryFilter !== 'All' ? ` in "${categoryFilter}"` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>

          {/* Grid */}
          {displayItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-14 text-center border border-gray-100 dark:border-gray-700">
              <ShoppingCart size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium mb-1">No items found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayItems.map(item => {
                const isOwn = item.sellerEmail === user?.email;
                return (
                  <div key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col group">
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${conditionColors[item.condition]}`}>
                        {item.condition}
                      </span>
                      {isOwn && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Your listing</span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold dark:text-white text-sm mb-1 truncate">{item.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2">Rs. {item.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Tag size={11} /> {item.category}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">by <span className="font-medium text-gray-600 dark:text-gray-300">{item.seller}</span> • {item.postedAt}</p>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => setShowDetailModal(item)}
                          className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                          Details
                        </button>
                        {!isOwn && (
                          <button onClick={() => onContactSeller?.(item.seller)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-1">
                            <MessageSquare size={14} /> Contact
                          </button>
                        )}
                        {isOwn && (
                          <button onClick={() => handleDelete(item.id)}
                            className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: LOCAL HATIYA
      ========================================== */}
      {activeTab === 'hatiya' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hatiyaMarkets.map(market => (
            <div key={market.id} className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800/30 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Store size={22} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white mb-1">{market.name}</h3>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 mb-1">
                  <CalendarDays size={13} /> {market.day}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                  <MapPin size={13} /> {market.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{market.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          TAB 3: CAFES & PLACES
      ========================================== */}
      {activeTab === 'places' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {localPlaces.map(place => (
            <div key={place.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-lg transition-shadow">
              <div className="h-40 overflow-hidden">
                <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-bold dark:text-white mb-0.5">{place.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{place.type} • {place.location}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${place.mapQuery}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors text-sm">
                  <ExternalLink size={15} /> Open in Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          MODAL: ITEM DETAIL
      ========================================== */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative">
              <img src={showDetailModal.image} alt={showDetailModal.title} className="w-full h-52 object-cover" />
              <button onClick={() => setShowDetailModal(null)}
                className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"><X size={18} /></button>
              <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold ${conditionColors[showDetailModal.condition]}`}>
                {showDetailModal.condition}
              </span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl dark:text-white">{showDetailModal.title}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full font-medium">{showDetailModal.category}</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mb-4">Rs. {showDetailModal.price.toLocaleString()}</p>
              <div className="space-y-2 mb-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><MapPin size={14} /> {showDetailModal.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                    {showDetailModal.seller.split(' ').map(n => n[0]).join('')}
                  </span>
                  {showDetailModal.seller} • {showDetailModal.postedAt}
                </p>
              </div>
              {showDetailModal.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-5 leading-relaxed">{showDetailModal.description}</p>
              )}
              {showDetailModal.sellerId !== user?.id ? (
                <button onClick={() => { onContactSeller?.(showDetailModal.sellerId); setShowDetailModal(null); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} /> Message Seller
                </button>
              ) : (
                <button onClick={() => handleDelete(showDetailModal.id)}
                  className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100">
                  <Trash2 size={18} /> Remove My Listing
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SELL AN ITEM
      ========================================== */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg dark:text-white">List an Item for Sale</h3>
              <button onClick={() => setShowSellModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSellSubmit} className="p-5 space-y-4">

              {/* Seller info (read-only) */}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-sm dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Listing as yourself</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Title <span className="text-red-400">*</span></label>
                <input required type="text" value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Symphony Cooler, Physics Book..."
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Rs.) <span className="text-red-400">*</span></label>
                  <input required type="number" min="1" value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                  <select value={newItem.condition} onChange={e => setNewItem({ ...newItem, condition: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none text-sm">
                    {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none text-sm">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location <span className="text-red-400">*</span></label>
                  <input required type="text" value={newItem.location}
                    onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="e.g. Itahari"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe the item — condition details, reason for selling, etc."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Image</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50 overflow-hidden relative">
                  {newItem.image ? (
                    <img src={newItem.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Plus size={24} />
                      <span className="text-xs font-medium">Add Photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                </label>
              </div>

              <button type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors mt-2">
                Post Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Marketplace;