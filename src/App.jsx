import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Si no está logueado, protegemos el sistema y mostramos solo el Login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Si ya inició sesión, mostramos todo el sistema
  return <Dashboard user={user} onLogout={handleLogout} />;
}