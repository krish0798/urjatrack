import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('urjatrack_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const loginWithToken = (newToken) => {
    localStorage.setItem('urjatrack_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('urjatrack_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
