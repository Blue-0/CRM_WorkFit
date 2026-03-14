import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('user_id');
    const savedEmail = localStorage.getItem('user_email');
    if (savedUserId && savedEmail) {
      setUser({ id: savedUserId, email: savedEmail });
    }
    setLoading(false);
  }, []);

  const login = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('user_email', userData.email);
        setUser(userData);
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Erreur lors de la connexion' };
      }
    } catch (err) {
      return { success: false, error: 'Impossible de contacter le serveur' };
    }
  };

  const register = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('user_email', userData.email);
        setUser(userData);
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Erreur lors de l\'inscription' };
      }
    } catch (err) {
      return { success: false, error: 'Impossible de contacter le serveur' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
