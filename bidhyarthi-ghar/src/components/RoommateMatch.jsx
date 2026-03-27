import React, { useState, useMemo } from 'react';
import {
  User, MapPin, BookOpen, X, MessageCircle,
  CheckCircle2, Search, ChevronDown, ChevronUp,
  Clock, Coffee, Moon, Sun, Cigarette, CigaretteOff,
  PawPrint, Dumbbell, Music, Utensils, Home, Filter,
  RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LOCATIONS = ['Any', 'Biratnagar', 'Itahari', 'Dharan', 'Sunsari', 'Morang'];
const BUDGETS = ['Any', 'Under Rs. 3k', 'Rs. 3k–5k', 'Rs. 5k–8k', 'Above Rs. 8k'];
const SLEEP_PREFS = ['Early Bird', 'Night Owl', 'Flexible'];
const HABITS_LIST = ['Non-Smoker', 'Smoker', 'Vegetarian', 'Non-Veg', 'Pet Friendly', 'No Pets', 'Gym Goer', 'Homebody', 'Social', 'Quiet/Studious', 'Music Lover'];
const COURSES = ['BSc Computing', 'BBA', 'BCA', 'BE Civil', 'BE Electronics', 'MBBS', 'Law', 'Other'];

const HABIT_ICONS = {
  'Non-Smoker': <CigaretteOff size={12} />,
  'Smoker': <Cigarette size={12} />,
  'Vegetarian': <Utensils size={12} />,
  'Non-Veg': <Utensils size={12} />,
  'Pet Friendly': <PawPrint size={12} />,
  'No Pets': <PawPrint size={12} />,
  'Gym Goer': <Dumbbell size={12} />,
  'Homebody': <Home size={12} />,
  'Social': <Coffee size={12} />,
  'Quiet/Studious': <BookOpen size={12} />,
  'Music Lover': <Music size={12} />,
  'Early Bird': <Sun size={12} />,
  'Night Owl': <Moon size={12} />,
  'Flexible': <Clock size={12} />,
};

const SEED_PROFILES = [
  { id: 1, name: 'Rohan Shrestha', course: 'BSc Computing', college: 'IIC', location: 'Itahari', budget: 'Rs. 3k–5k', sleep: 'Night Owl', habits: ['Non-Smoker', 'Quiet/Studious', 'Vegetarian'], bio: 'Looking for a quiet flatmate to share a 2BHK near IIC campus. I study late but keep things tidy.', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80', gender: 'Male', available: 'Immediately' },
  { id: 2, name: 'Sita Tamang', course: 'BBA', college: 'IIC', location: 'Dharan', budget: 'Rs. 3k–5k', sleep: 'Early Bird', habits: ['Non-Smoker', 'Pet Friendly', 'Social'], bio: 'Need a female roommate for a PG near the hospital. Love cooking and keeping a clean space.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', gender: 'Female', available: 'Next month' },
  { id: 3, name: 'Aarav Thapa', course: 'BBA', college: 'IIC', location: 'Biratnagar', budget: 'Rs. 5k–8k', sleep: 'Early Bird', habits: ['Non-Smoker', 'Gym Goer', 'Non-Veg'], bio: 'Chill flatmate wanted. I go to the gym every morning and am rarely home in the evenings.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', gender: 'Male', available: 'Immediately' },
  { id: 4, name: 'Priya Gurung', course: 'MBBS', college: 'BPKIHS', location: 'Dharan', budget: 'Rs. 5k–8k', sleep: 'Flexible', habits: ['Non-Smoker', 'Quiet/Studious', 'Vegetarian', 'No Pets'], bio: 'Medical student with irregular hours. Looking for someone understanding about late-night studying.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', gender: 'Female', available: 'Immediately' },
  { id: 5, name: 'Bikash Rai', course: 'BE Civil', college: 'Purwanchal', location: 'Itahari', budget: 'Under Rs. 3k', sleep: 'Night Owl', habits: ['Smoker', 'Social', 'Music Lover', 'Non-Veg'], bio: 'Looking for a budget room share. I work on projects till late and enjoy music on weekends.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', gender: 'Male', available: 'Next month' },
  { id: 6, name: 'Anisha Karki', course: 'BCA', college: 'Mechi', location: 'Biratnagar', budget: 'Rs. 3k–5k', sleep: 'Early Bird', habits: ['Non-Smoker', 'Quiet/Studious', 'No Pets', 'Homebody'], bio: 'BCA student looking to share a flat close to college. Prefer someone focused on studies.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', gender: 'Female', available: 'Immediately' },
];

const EMPTY_PROFILE = { course: '', college: '', location: 'Any', budget: 'Any', sleep: 'Flexible', habits: [], bio: '', gender: '', available: 'Immediately' };

function calculateMatch(mine, other) {
  let score = 0, total = 0;
  total += 25; if (mine.location === 'Any' || mine.location === other.location) score += 25;
  total += 20; if (mine.budget === 'Any' || mine.budget === other.budget) score += 20;
  total += 20; if (mine.sleep === 'Flexible' || other.sleep === 'Flexible' || mine.sleep === other.sleep) score += 20;
  if (mine.habits.length > 0) {
    total += 35;
    const overlap = mine.habits.filter(h => other.habits.includes(h)).length;
    score += Math.round((overlap / mine.habits.length) * 35);
  }
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

function matchColor(score) {
  if (score >= 80) return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' };
  if (score >= 60) return { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
  if (score >= 40) return { bar: 'bg-yellow-500', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' };
  return { bar: 'bg-gray-400', text: 'text-gray-500', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
}

export default function RoommateMatch({ onConnect }) {
  const { user } = useAuth();

  const [myProfile, setMyProfile] = useState(EMPTY_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const [skipped, setSkipped] = useState([]);
  const [connected, setConnected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [detailProfile, setDetailProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState('Any');
  const [filterBudget, setFilterBudget] = useState('Any');
  const [filterGender, setFilterGender] = useState('Any');

  const toggleHabit = h => setMyProfile(p => ({ ...p, habits: p.habits.includes(h) ? p.habits.filter(x => x !== h) : [...p.habits, h] }));

  const saveProfile = e => { e.preventDefault(); setProfileSaved(true); setShowProfilePanel(false); };

  const scoredProfiles = useMemo(() => SEED_PROFILES.map(p => ({
    ...p,
    match: profileSaved ? calculateMatch(myProfile, p) : Math.floor(Math.random() * 30) + 60,
  })), [myProfile, profileSaved]);

  const displayProfiles = useMemo(() => {
    let r = scoredProfiles.filter(p => !skipped.includes(p.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.course.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q));
    }
    if (filterLocation !== 'Any') r = r.filter(p => p.location === filterLocation);
    if (filterBudget !== 'Any') r = r.filter(p => p.budget === filterBudget);
    if (filterGender !== 'Any') r = r.filter(p => p.gender === filterGender);
    if (sortBy === 'match') r = [...r].sort((a, b) => b.match - a.match);
    if (sortBy === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'available') r = [...r].sort((a, b) => a.available.localeCompare(b.available));
    return r;
  }, [scoredProfiles, skipped, searchQuery, filterLocation, filterBudget, filterGender, sortBy]);

  const handleSkip = id => setSkipped(s => [...s, id]);
  const handleConnect = id => { setConnected(c => [...c, id]); onConnect?.(); };

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    // NO max-w or mx-auto here — full width
    <div className="space-y-5">

      {/* My Preferences panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button onClick={() => setShowProfilePanel(v => !v)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">{userInitials}</div>
            <div className="text-left">
              <p className="font-bold dark:text-white text-sm">My Preferences</p>
              <p className="text-xs text-gray-400">
                {profileSaved
                  ? `${myProfile.habits.length} habits • ${myProfile.location} • ${myProfile.budget}`
                  : 'Set your preferences to get accurate match scores'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {profileSaved && <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Check size={11} /> Saved</span>}
            {showProfilePanel ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </div>
        </button>

        {showProfilePanel && (
          <form onSubmit={saveProfile} className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Course', value: myProfile.course, key: 'course', opts: ['', ...COURSES], placeholder: 'Select...' },
                { label: 'Location', value: myProfile.location, key: 'location', opts: LOCATIONS },
                { label: 'Budget', value: myProfile.budget, key: 'budget', opts: BUDGETS },
                { label: 'Sleep', value: myProfile.sleep, key: 'sleep', opts: SLEEP_PREFS },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <select value={f.value} onChange={e => setMyProfile(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    {f.placeholder && <option value="">{f.placeholder}</option>}
                    {f.opts.filter(o => o !== '').map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">My Habits & Lifestyle</label>
              <div className="flex flex-wrap gap-2">
                {HABITS_LIST.map(h => (
                  <button key={h} type="button" onClick={() => toggleHabit(h)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${myProfile.habits.includes(h) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {HABIT_ICONS[h]}{h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Short Bio</label>
              <textarea value={myProfile.bio} onChange={e => setMyProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell potential roommates about yourself..." rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                <Check size={16} /> Save & Find Matches
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search + sort + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, course, location..."
            className="w-full pl-9 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-lg text-sm outline-none">
          <option value="match">Sort: Best Match</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="available">Sort: Availability</option>
        </select>
        <button onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>
          <Filter size={15} /> Filters
          {[filterLocation, filterBudget, filterGender].filter(v => v !== 'Any').length > 0 && (
            <span className="w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {[filterLocation, filterBudget, filterGender].filter(v => v !== 'Any').length}
            </span>
          )}
        </button>
        {skipped.length > 0 && (
          <button onClick={() => setSkipped(s => s.slice(0, -1))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 text-sm hover:text-blue-600 transition-colors">
            <RefreshCw size={14} /> Undo Skip ({skipped.length})
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-4">
          {[
            { label: 'Location', value: filterLocation, set: setFilterLocation, opts: LOCATIONS },
            { label: 'Budget', value: filterBudget, set: setFilterBudget, opts: BUDGETS },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">{f.label}</label>
              <select value={f.value} onChange={e => f.set(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg text-sm outline-none">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Gender</label>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg text-sm outline-none">
              <option value="Any">Any</option><option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setFilterLocation('Any'); setFilterBudget('Any'); setFilterGender('Any'); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors">Clear all</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          {displayProfiles.length} potential roommates
          {!profileSaved && <span className="ml-1 text-amber-500">• Save your profile for accurate match scores</span>}
        </p>
        {connected.length > 0 && (
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full font-bold">{connected.length} connected</span>
        )}
      </div>

      {/* Cards — full width grid */}
      {displayProfiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-14 text-center border border-gray-100 dark:border-gray-700">
          <User size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-1">No matches found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or undoing skips</p>
          {skipped.length > 0 && <button onClick={() => setSkipped([])} className="text-sm text-blue-600 hover:underline">Reset all skips</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayProfiles.map(profile => {
            const colors = matchColor(profile.match);
            const isConnected = connected.includes(profile.id);
            return (
              <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${colors.badge}`}>{profile.match}% match</div>
                  {isConnected && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Check size={11} /> Connected
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-base leading-tight">{profile.name}</h3>
                    <p className="text-gray-300 text-xs flex items-center gap-1 mt-0.5"><BookOpen size={11} /> {profile.course} • {profile.college}</p>
                  </div>
                </div>

                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Compatibility</span>
                    <span className={`text-xs font-bold ${colors.text}`}>{profile.match}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${profile.match}%` }} />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {profile.location}</span>
                    <span className="flex items-center gap-1"><Home size={11} /> {profile.budget}</span>
                    <span className="flex items-center gap-1">
                      {profile.sleep === 'Night Owl' ? <Moon size={11} /> : profile.sleep === 'Early Bird' ? <Sun size={11} /> : <Clock size={11} />}
                      {profile.sleep}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {profile.habits.map(h => (
                      <span key={h} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${myProfile.habits.includes(h) && profileSaved ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {HABIT_ICONS[h]}{h}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 italic mb-1 line-clamp-2">"{profile.bio}"</p>
                  <p className="text-xs text-gray-400 mb-4">Available: <span className="font-medium text-gray-600 dark:text-gray-300">{profile.available}</span></p>

                  <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => setDetailProfile(profile)}
                      className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      View Profile
                    </button>
                    {!isConnected ? (
                      <>
                        <button onClick={() => handleSkip(profile.id)} className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><X size={15} /></button>
                        <button onClick={() => handleConnect(profile.id)} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
                          <MessageCircle size={14} /> Connect
                        </button>
                      </>
                    ) : (
                      <button className="flex-1 py-2 rounded-lg bg-green-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-default">
                        <Check size={14} /> Connected
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-52">
              <img src={detailProfile.image} alt={detailProfile.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button onClick={() => setDetailProfile(null)} className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"><X size={18} /></button>
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${matchColor(detailProfile.match).badge}`}>{detailProfile.match}% match</div>
              <div className="absolute bottom-3 left-4">
                <h3 className="font-bold text-white text-xl">{detailProfile.name}</h3>
                <p className="text-gray-300 text-xs">{detailProfile.course} • {detailProfile.college}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Compatibility</span>
                  <span className={`font-bold ${matchColor(detailProfile.match).text}`}>{detailProfile.match}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div className={`h-full ${matchColor(detailProfile.match).bar} rounded-full`} style={{ width: `${detailProfile.match}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[['Location', detailProfile.location], ['Budget', detailProfile.budget], ['Sleep', detailProfile.sleep], ['Gender', detailProfile.gender], ['Available', detailProfile.available], ['College', detailProfile.college]].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Habits</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailProfile.habits.map(h => (
                    <span key={h} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${myProfile.habits.includes(h) && profileSaved ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {HABIT_ICONS[h]}{h}
                      {myProfile.habits.includes(h) && profileSaved && <CheckCircle2 size={10} className="ml-0.5" />}
                    </span>
                  ))}
                </div>
                {profileSaved && myProfile.habits.length > 0 && <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Blue = shared with you</p>}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">"{detailProfile.bio}"</p>
              </div>
              {!connected.includes(detailProfile.id) ? (
                <button onClick={() => { handleConnect(detailProfile.id); setDetailProfile(null); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Connect with {detailProfile.name.split(' ')[0]}
                </button>
              ) : (
                <div className="w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-3 rounded-xl font-bold text-center border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                  <Check size={18} /> Already Connected
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}