import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('finvault_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setReady(true);
  }, []);

  const login = (userData) => {
    localStorage.setItem('finvault_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('finvault_user');
    setUser(null);
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
