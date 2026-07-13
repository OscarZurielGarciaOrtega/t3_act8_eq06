export default function Sidebar() {
  const opciones = [
    { nombre: 'Nueva ruta', icono: '🗺️', activo: true },
    { nombre: 'Historial', icono: '🕒', activo: false },
    { nombre: 'Favoritos', icono: '⭐', activo: false },
    { nombre: 'Buscar', icono: '🔍', activo: false },
    { nombre: 'Ajustes', icono: '⚙️', activo: false },
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
        {opciones.map((opcion, index) => (
          <li key={index} style={{ marginBottom: '0.4rem' }}>
            <a 
              href={`#${opcion.nombre.toLowerCase()}`} 
              onClick={(e) => e.preventDefault()}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.75rem 1rem', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                color: opcion.activo ? '#008f39' : '#4a5568', 
                backgroundColor: opcion.activo ? '#e8f5e9' : 'transparent', 
                fontWeight: opcion.activo ? '700' : '500',
                fontSize: '0.95rem'
              }}
            >
              <span>{opcion.icono}</span>
              <span>{opcion.nombre}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}