import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';

export default function Dashboard({ user, onLogout, currentView, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f5f7' }}>
      <Navbar user={user} onLogout={onLogout} />
      
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        
       
        <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
          
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1a202c', fontWeight: '800' }}>Rutas recientes</h2>
              <p style={{ margin: '0.2rem 0 0', color: '#718096', fontSize: '0.9rem' }}>Basado en tu ruta de Oaxaca a Puebla</p>
            </div>
            
            <button style={{
              backgroundColor: '#008f39',
              color: 'white',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 143, 57, 0.2)'
            }}>
              + Planear nueva parada
            </button>
          </div>

          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
            <DataTable />
          </div>

          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            
            
            <div>
              <h3 style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem', fontWeight: '600' }}>Categorías más buscadas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {['☕ Cafeterías', '📸 Miradores', '🏡 Pueblos mágicos'].map((cat, i) => (
                  <div key={i} style={{
                    padding: '0.8rem 1.2rem',
                    backgroundColor: '#ffedd5',
                    color: '#c2410c',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: '1px solid #fed7aa',
                    cursor: 'pointer'
                  }}>
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#2d3748', fontWeight: '700', textAlign: 'center' }}>Tendencia ahora</h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>247 viajeros</strong> exploraron Oaxaca hoy</li>
                <li>"Mural del Centro" es la parada más guardada esta semana</li>
              </ul>
            </div>

          </div>

         
          <footer style={{ textAlign: 'center', marginTop: '3rem', color: '#a0aec0', fontSize: '0.8rem' }}>
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}