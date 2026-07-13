import { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, ingresa tu correo/usuario y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(username, password);
      onLoginSuccess(data);
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      backgroundColor: '#f8f9fa', 
      fontFamily: "'Inter', sans-serif" 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        padding: '3rem 2.5rem', 
        backgroundColor: '#f2f3f5', 
        borderRadius: '16px', 
        width: '380px', 
        border: '1.5px solid #d1d5db',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        
        <h1 style={{ 
          color: '#008f39', 
          fontSize: '2rem', 
          fontWeight: '800', 
          marginBottom: '2.5rem',
          letterSpacing: '-0.5px',
          fontFamily: "'Inter', sans-serif"
        }}>
          StopOver
        </h1>

        
        {error && (
          <div style={{ 
            width: '100%',
            backgroundColor: '#ffe6e6', 
            color: '#d63031', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            fontSize: '0.85rem', 
            textAlign: 'center', 
            fontWeight: '600',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        )}

        
        <div style={{ width: '100%', marginBottom: '1.2rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.9rem 1.2rem', 
              boxSizing: 'border-box', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db', 
              fontSize: '0.95rem',
              backgroundColor: '#ffffff',
              color: '#4a5568', 
              fontWeight: '700', 
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
            placeholder="Correo electrónico"
          />
        </div>

        
        <div style={{ width: '100%', marginBottom: '0.8rem', position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.9rem 2.8rem 0.9rem 1.2rem', 
              boxSizing: 'border-box', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db', 
              fontSize: '0.95rem',
              backgroundColor: '#ffffff',
              color: '#4a5568',
              fontWeight: '700',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
            placeholder="Contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#2d3748',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
            title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? '🐵' : '👁️'}
          </button>
        </div>

        
        <div style={{ width: '100%', textAlign: 'right', marginBottom: '2rem' }}>
          <a href="#olvide" onClick={(e) => e.preventDefault()} style={{ 
            color: '#718096', 
            fontSize: '0.85rem', 
            textDecoration: 'none',
            fontWeight: '500',
            fontFamily: "'Inter', sans-serif"
          }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        
        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.9rem', 
            backgroundColor: '#00a843', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 10px rgba(0, 168, 67, 0.2)',
            transition: 'background 0.2s',
            marginBottom: '2rem',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>

        
        <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500', fontFamily: "'Inter', sans-serif" }}>
          ¿No tienes cuenta?{' '}
          <a href="#registro" onClick={(e) => e.preventDefault()} style={{ 
            color: '#4a5568', 
            textDecoration: 'underline',
            fontWeight: '700'
          }}>
            Regístrate
          </a>
        </div>
      </form>
    </div>
  );
}