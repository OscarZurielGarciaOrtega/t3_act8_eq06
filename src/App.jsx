import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites'; 

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

 
  const [currentView, setCurrentView] = useState('rutas');

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  
  if (currentView === 'favoritos') {
    return (
      <Favorites 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />
    );
  }

  
  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
    />
  );
}