export default function FavoriteCard({ item, onRemove }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Imagen */}
      <div style={{ height: '160px', backgroundColor: '#e2e8f0', position: 'relative' }}>
        <img 
          src={item.thumbnail || 'https://via.placeholder.com/300x160?text=StopOver+Ruta'} 
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '0.3rem 0.6rem',
          borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', color: '#008f39'
        }}>
          ⭐ Guardado
        </span>
      </div>

      {/* Contenido */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#008f39', textTransform: 'uppercase' }}>
            {item.category || 'Destino'}
          </span>
          <span style={{ fontWeight: '800', color: '#1a202c', fontSize: '1rem' }}>
            ${item.price} USD
          </span>
        </div>

        <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.1rem', color: '#1a202c', fontWeight: '700' }}>
          {item.title}
        </h3>

        <p style={{ margin: '0 0 1.2rem', color: '#718096', fontSize: '0.85rem', flex: 1 }}>
          {item.description ? `${item.description.substring(0, 65)}...` : 'Excelente parada verificada por la comunidad.'}
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <button style={{ flex: 1, padding: '0.6rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            🗺️ Ver ruta
          </button>
          <button onClick={() => onRemove(item.id, item.title)} style={{ padding: '0.6rem 0.8rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer' }}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}