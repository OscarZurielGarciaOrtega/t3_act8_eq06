import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FavoriteCard from '../components/FavoriteCard';
import { fetchProducts } from '../services/api';

// AQUÍ ESTÁ EL SECRETO: Agregamos currentView y onNavigate en los paréntesis
export default function Favorites({ user, onLogout, currentView, onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ limit: 6, skip: 2 });
        setFavorites(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRemove = (id, title) => {
    if (window.confirm(`¿Quitar "${title}" de favoritos?`)) {
      setFavorites(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f5f7' }}>
      {/* 1. Navbar superior */}
      <Navbar user={user} onLogout={onLogout} />
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 2. Menú lateral: AQUÍ SE LAS PASAMOS AL SIDEBAR PARA QUE LOS CLICS FUNCIONEN */}
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        
        {/* 3. Contenido Principal de la Página de Favoritos */}
        <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1a202c', fontWeight: '800' }}>⭐ Tus Rutas Favoritas</h2>
            <p style={{ margin: '0.2rem 0 0', color: '#718096', fontSize: '0.9rem' }}>Gestión de tus escalas y destinos guardados.</p>
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>⏳ Cargando favoritos...</p>}

          {/* Renderizado limpio llamando al COMPONENTE */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
              {favorites.map((item) => (
                <FavoriteCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}