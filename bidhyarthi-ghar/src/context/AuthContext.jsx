import React, { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bg_user')); } catch { return null; }
  });

  const saveSession = (token, userData) => {
    localStorage.setItem('bg_token', token);
    localStorage.setItem('bg_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      saveSession(data.token, data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async ({ name, email, password, role }) => {
    try {
      const data = await api.register({ name, email, password, role });
      saveSession(data.token, data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bg_user');
    localStorage.removeItem('bg_token');
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getProfile();
      localStorage.setItem('bg_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}