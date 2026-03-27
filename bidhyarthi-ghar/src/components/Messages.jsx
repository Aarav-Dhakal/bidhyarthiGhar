import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, MessageSquare, Plus, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

// ==========================================
// SEED CHATS
// ==========================================
const seedChats = [
  {
    id: 1, type: 'Match', name: 'Rohan Shrestha', unread: 2,
    messages: [
      { id: 101, text: "Hey! Saw we have a 92% match. Are you still looking for a room?", sender: 'them', time: '10:28 AM' },
      { id: 102, text: "I found a nice 2BHK near IIC. Interested?", sender: 'them', time: '10:30 AM' },
    ],
  },
  {
    id: 2, type: 'Owner', name: 'Landlord — Kanchanbari', unread: 1,
    messages: [
      { id: 201, text: "The 2BHK is available next month. When can you visit?", sender: 'them', time: 'Yesterday, 4:15 PM' },
    ],
  },
  {
    id: 3, type: 'Seller', name: 'Priya (Books)', unread: 0,
    messages: [
      { id: 301, text: "Are the BBA books still available?", sender: 'me', time: 'Tuesday, 10:00 AM' },
      { id: 302, text: "Yes! Come pick them up anytime. I can do Rs. 800 for the set.", sender: 'them', time: 'Tuesday, 10:15 AM' },
    ],
  },
];

// People you can start a new chat with
const CONTACTS = [
  { name: 'Sita Tamang', type: 'Match' },
  { name: 'Aarav Thapa', type: 'Match' },
  { name: 'Bikash Rai', type: 'Seller' },
  { name: 'Anisha Karki', type: 'Seller' },
  { name: 'Landlord — Dharan', type: 'Owner' },
  { name: 'Landlord — Itahari', type: 'Owner' },
];

const TYPE_COLORS = {
  Match: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Seller: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const AVATAR_COLORS = {
  Match: 'bg-blue-600',
  Owner: 'bg-purple-600',
  Seller: 'bg-green-600',
};

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ==========================================
// MESSAGES COMPONENT
// ==========================================
export default function Messages({ initialPartnerId, onPartnerSelect }) {
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getConversations();
        const mapped = data.map(c => ({
          id: c.partner_id,
          name: c.partner_name,
          type: c.partner_role === 'landlord' ? 'Owner' : 'Match', // Simplified mapping
          lastMsg: c.last_msg,
          time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0
        }));
        setChats(mapped);
        if (mapped.length > 0 && !activeChatId) setActiveChatId(mapped[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChatId) return;
    const loadMessages = async () => {
      try {
        const data = await api.getChatHistory(activeChatId);
        setMessages(data.map(m => ({
          id: m.id,
          text: m.content,
          sender: m.sender_id === user?.id ? 'me' : 'them',
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Chat polling faster
    return () => clearInterval(interval);
  }, [activeChatId, user?.id]);

  // Handle initial partner
  useEffect(() => {
    if (initialPartnerId) {
      const existing = chats.find(c => c.id === initialPartnerId);
      if (existing) {
        setActiveChatId(initialPartnerId);
      } else {
        // Create temp chat for new partner
        const loadPartner = async () => {
          try {
            // Need a way to get partner name if not in chats
            // For now, we'll just try to find them in the chat history or ignore
            setActiveChatId(initialPartnerId);
          } catch (err) {}
        };
        loadPartner();
      }
      if (onPartnerSelect) onPartnerSelect();
    }
  }, [initialPartnerId, chats]);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Focus input when switching chats
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  // Open chat → clear unread (mock for now as backend doesn't track unread yet)
  const handleChatClick = (id) => {
    setActiveChatId(id);
    setShowNewChat(false);
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;
    const text = inputText.trim();
    setInputText('');
    try {
      const sent = await api.sendMessage(activeChatId, text);
      setMessages(prev => [...prev, {
        id: sent.id,
        text: sent.content,
        sender: 'me',
        time: nowTime()
      }]);
    } catch (err) {
      alert("Failed to send: " + err.message);
    }
  };

  // Start new chat with a contact
  const handleNewChat = (contact) => {
    // Check if chat already exists
    const existing = chats.find(c => c.name === contact.name);
    if (existing) {
      handleChatClick(existing.id);
      return;
    }
    const newChat = {
      id: Date.now(),
      type: contact.type,
      name: contact.name,
      unread: 0,
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setShowNewChat(false);
    setNewChatSearch('');
  };

  // Filtered chat list
  const filteredChats = chats.filter(c => {
    const matchType = filterType === 'All' || c.type === filterType;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Filtered contacts for new chat modal
  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(newChatSearch.toLowerCase()) &&
    !chats.find(ch => ch.name === c.name) // hide already-existing chats
  );

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex h-[630px] overflow-hidden">

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <div className="w-80 border-r border-gray-100 dark:border-gray-700 flex flex-col flex-shrink-0">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold dark:text-white text-sm">Messages</h3>
              {totalUnread > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{totalUnread} new</span>
              )}
            </div>
            {/* New chat button */}
            <button onClick={() => setShowNewChat(v => !v)}
              className={`p-1.5 rounded-lg transition-colors ${showNewChat ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600'}`}
              title="Start new conversation">
              {showNewChat ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>

          {/* New chat panel */}
          {showNewChat && (
            <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Start a conversation</p>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                <input type="text" value={newChatSearch} onChange={e => setNewChatSearch(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No contacts found</p>
                ) : filteredContacts.map(c => (
                  <button key={c.name} onClick={() => handleNewChat(c)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-left">
                    <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[c.type] || 'bg-gray-500'} text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0`}>
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold dark:text-white truncate block">{c.name}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${TYPE_COLORS[c.type] || ''}`}>{c.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Owner', 'Seller', 'Match'].map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap transition-colors ${filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-2">No conversations found</p>
              <button onClick={() => setShowNewChat(true)}
                className="text-xs text-blue-600 hover:underline">Start a new one</button>
            </div>
          ) : filteredChats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isActive = activeChatId === chat.id;
            const avatarColor = AVATAR_COLORS[chat.type] || 'bg-gray-500';

            return (
              <button key={chat.id} onClick={() => handleChatClick(chat.id)}
                className={`w-full p-4 flex items-start gap-3 text-left border-b border-gray-50 dark:border-gray-700/50 transition-colors ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}>
                <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                  {getInitials(chat.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{chat.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-1 ${TYPE_COLORS[chat.type] || ''}`}>
                      {chat.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {!chat.lastMsg
                      ? <span className="italic">No messages yet</span>
                      : chat.lastMsg
                    }
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {chat.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          MAIN CHAT AREA
      ========================================== */}
      {activeChat ? (
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[activeChat.type] || 'bg-gray-500'} text-white flex items-center justify-center font-bold text-xs`}>
                {getInitials(activeChat.name)}
              </div>
              <div>
                <p className="font-bold dark:text-white text-sm">{activeChat.name}</p>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
                </p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${TYPE_COLORS[activeChat.type] || ''}`}>
              {activeChat.type}
            </span>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">

            {/* Empty state for new chats */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className={`w-14 h-14 rounded-full ${AVATAR_COLORS[activeChat.type] || 'bg-gray-400'} text-white flex items-center justify-center font-bold text-xl mb-3`}>
                  {getInitials(activeChat.name)}
                </div>
                <p className="font-semibold dark:text-white mb-1">{activeChat.name}</p>
                <p className="text-xs text-gray-400 max-w-xs">This is the beginning of your conversation. Say hello!</p>
              </div>
            )}

            {messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[activeChat.type] || 'bg-gray-500'} text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mb-0.5`}>
                      {getInitials(activeChat.name)}
                    </div>
                  )}
                  <div className={`max-w-[68%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                      }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                  </div>
                  {isMe && (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mb-0.5">
                      {userInitials}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <form onSubmit={handleSend}
            className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeChat.name.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={!inputText.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium mb-2">Select a conversation</p>
            <button onClick={() => setShowNewChat(true)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1 mx-auto">
              <Plus size={14} /> Start a new one
            </button>
          </div>
        </div>
      )}
    </div>
  );
}