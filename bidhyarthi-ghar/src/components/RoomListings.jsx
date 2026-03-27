import React, { useState } from 'react';
import { Search, MapPin, Star, Map, Building, CheckCircle2, X } from 'lucide-react';

const allProperties = [
  { id: 1, type: 'Flat',   title: '2BHK Premium Flat',       location: 'Kanchanbari, Biratnagar', price: 12000, priceText: 'Rs. 12,000/mo',  rating: 4.8, amenities: ['Kitchen','Parking','Water'],              isCommercial: false, image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80' },
  { id: 2, type: 'Room',   title: 'Single Room for Student',  location: 'Near IIC College, Itahari',price: 4000,  priceText: 'Rs. 4,000/mo',   rating: 4.5, amenities: ['Shared Bathroom','Wi-Fi'],               isCommercial: false, image: 'https://images.unsplash.com/photo-1522771731470-53ff720dc08b?w=800&q=80' },
  { id: 3, type: 'Hostel', title: 'Everest Boys Hostel',      location: 'Tinkune, Dharan',          price: 8500,  priceText: 'Rs. 8,500/mo',   rating: 4.2, amenities: ['Food Included','Laundry','Wi-Fi'],       isCommercial: true,  mapQuery: 'Everest+Boys+Hostel+Dharan',         image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80' },
  { id: 4, type: 'Hotel',  title: 'Hotel Harrison Palace',    location: 'Biratnagar',               price: 3500,  priceText: 'Rs. 3,500/night', rating: 4.9, amenities: ['AC','Breakfast','Housekeeping'],        isCommercial: true,  mapQuery: 'Hotel+Harrison+Palace+Biratnagar',   image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  { id: 5, type: 'Hostel', title: 'Shanti Girls Hostel',      location: 'Sundar Dulari, Morang',    price: 7000,  priceText: 'Rs. 7,000/mo',   rating: 4.6, amenities: ['Food Included','Security','Study Room'],isCommercial: true,  mapQuery: 'Sundar+Dulari+Morang',               image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80' },
  { id: 6, type: 'Hotel',  title: 'Hotel Soaltee Westend',    location: 'Itahari',                  price: 5500,  priceText: 'Rs. 5,500/night', rating: 4.8, amenities: ['Pool','AC','Restaurant'],             isCommercial: true,  mapQuery: 'Soaltee+Westend+Itahari',            image: 'https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=800&q=80' },
  { id: 7, type: 'Room',   title: 'Double Sharing Room',      location: 'Bhanu Chowk, Dharan',      price: 3000,  priceText: 'Rs. 3,000/mo',   rating: 4.1, amenities: ['Balcony','Water'],                     isCommercial: false, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
  { id: 8, type: 'Hostel', title: 'Pioneer Student Hostel',   location: 'Biratnagar',               price: 9000,  priceText: 'Rs. 9,000/mo',   rating: 4.7, amenities: ['AC Rooms','4 Meals','Gym'],            isCommercial: true,  mapQuery: 'Hostels+in+Biratnagar',              image: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=800&q=80' },
];

const TYPE_COLORS = {
  Flat:   'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  Room:   'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  Hostel: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  Hotel:  'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
};

export default function RoomListings({ onContactOwner }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const filtered = allProperties.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    const matchType   = typeFilter === 'All' || p.type === typeFilter;
    let   matchPrice  = true;
    if (priceFilter === 'under5k')  matchPrice = p.price < 5000;
    if (priceFilter === '5k-10k')   matchPrice = p.price >= 5000 && p.price <= 10000;
    if (priceFilter === 'over10k')  matchPrice = p.price > 10000;
    return matchSearch && matchType && matchPrice;
  });

  const hasFilters = searchQuery || typeFilter !== 'All' || priceFilter !== 'All';
  const clearAll   = () => { setSearchQuery(''); setTypeFilter('All'); setPriceFilter('All'); };

  return (
    <div className="space-y-5">

      {/* Search + filter bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none">
          <option value="All">All Types</option>
          <option value="Room">Rooms</option>
          <option value="Flat">Flats</option>
          <option value="Hostel">Hostels</option>
          <option value="Hotel">Hotels</option>
        </select>
        <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none">
          <option value="All">Any Price</option>
          <option value="under5k">Under Rs. 5,000</option>
          <option value="5k-10k">Rs. 5,000 – 10,000</option>
          <option value="over10k">Over Rs. 10,000</option>
        </select>
      </div>

      {/* Active filter badges */}
      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          {searchQuery && (
            <span className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
              "{searchQuery}" <button onClick={() => setSearchQuery('')}><X size={11}/></button>
            </span>
          )}
          {typeFilter !== 'All' && (
            <span className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-medium">
              {typeFilter} <button onClick={() => setTypeFilter('All')}><X size={11}/></button>
            </span>
          )}
          {priceFilter !== 'All' && (
            <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full font-medium">
              {priceFilter === 'under5k' ? 'Under 5k' : priceFilter === '5k-10k' ? '5k–10k' : 'Over 10k'}
              <button onClick={() => setPriceFilter('All')}><X size={11}/></button>
            </span>
          )}
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors underline">Clear all</button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-14 text-center border border-gray-100 dark:border-gray-700">
          <Search size={36} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-400 font-medium mb-1">No properties found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
          <button onClick={clearAll} className="text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${TYPE_COLORS[p.type] || ''}`}>{p.type}</span>
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-lg">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{p.priceText}</p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold dark:text-white truncate text-sm">{p.title}</h3>
                  <div className="flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 px-2 py-0.5 rounded flex-shrink-0 ml-1">
                    <Star size={11} fill="currentColor"/><span className="font-bold">{p.rating}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs flex items-center gap-1 mb-3"><MapPin size={11}/> {p.location}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.amenities.map(a => (
                    <span key={a} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 size={10}/> {a}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                  {p.isCommercial ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${p.mapQuery}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <Map size={14}/> View on Google Maps
                    </a>
                  ) : (
                    <button onClick={() => onContactOwner?.()}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Building size={14}/> Contact Owner
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}