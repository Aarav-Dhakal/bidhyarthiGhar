// Central API helper — automatically attaches JWT from localStorage
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('bg_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

const api = {
  // Auth / Profile
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  getProfile: ()   => request('/auth/profile'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Rooms
  getRooms:    ()       => request('/rooms'),
  getMyRooms:  ()       => request('/rooms/mine'),
  createRoom:  (body)   => request('/rooms',      { method: 'POST',   body: JSON.stringify(body) }),
  updateRoom:  (id, body) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRoom:  (id)     => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Marketplace
  getMarketplace:   ()     => request('/marketplace'),
  createItem:       (body) => request('/marketplace', { method: 'POST',   body: JSON.stringify(body) }),
  deleteItem:       (id)   => request(`/marketplace/${id}`, { method: 'DELETE' }),
  // Messaging
  getConversations: ()      => request('/messages/conversations'),
  getChatHistory:   (id)    => request(`/messages/${id}`),
  sendMessage:      (receiverId, content) => request('/messages', { method: 'POST', body: JSON.stringify({ receiverId, content }) }),
};

export default api;
