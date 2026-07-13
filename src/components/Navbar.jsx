export default function Navbar({ user, onLogout }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.8rem 2rem', 
      backgroundColor: '#f2f2f2', 
      color: '#333', 
      borderBottom: '1px solid #d1d5db',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📍</span>
        <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#008f39', fontWeight: '800' }}>StopOver</h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img 
          src={user?.image || 'https://via.placeholder.com/40'} 
          alt="Perfil" 
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }} 
        />
        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#4a5568' }}>
          {user?.firstName} {user?.lastName}
        </span>
        <button 
          onClick={onLogout}
          style={{ 
            padding: '0.4rem 0.8rem', 
            backgroundColor: 'transparent', 
            color: '#d63031', 
            border: '1px solid #d63031', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.8rem',
            transition: 'all 0.2s'
          }}
          title="Cerrar sesión"
        >
          Salir
        </button>
      </div>
    </header>
  );
}