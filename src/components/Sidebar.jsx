export default function Sidebar({ currentView = 'rutas', onNavigate }) {
  const opciones = [
    { id: 'rutas', nombre: 'Rutas recientes', icono: '🗺️' },
    { id: 'historial', nombre: 'Historial', icono: '🕒' },
    { id: 'favoritos', nombre: 'Favoritos', icono: '⭐' },
    { id: 'buscar', nombre: 'Buscar', icono: '🔍' },
    { id: 'ajustes', nombre: 'Ajustes', icono: '⚙️' },
  ];

  return (
    <aside style={{ 
      width: '220px', 
      backgroundColor: '#f8f9fa', 
      padding: '1.5rem 0.8rem', 
      borderRight: '1px solid #e2e8f0',
      minHeight: 'calc(100vh - 60px)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {opciones.map((opcion) => {
          const activo = currentView === opcion.id;
          return (
            <li key={opcion.id} style={{ marginBottom: '0.4rem' }}>
              <a 
                href={`#${opcion.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  // Si tiene función de navegación y hacen clic, cambiamos de pantalla
                  if (onNavigate) onNavigate(opcion.id);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  textDecoration: 'none', 
                  color: activo ? '#008f39' : '#4a5568', 
                  backgroundColor: activo ? '#e8f5e9' : 'transparent', 
                  fontWeight: activo ? '700' : '500',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <span>{opcion.icono}</span>
                <span>{opcion.nombre}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}