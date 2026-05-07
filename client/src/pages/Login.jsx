import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F7F7FF 0%, #EEF0FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3.5rem' }}>🎓</div>
          <h1 style={{ fontSize: '2rem', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back!</h1>
          <p style={{ color: '#888', marginTop: 4 }}>Your study plan awaits 📖</p>
        </div>
        {error && <div style={{ background: '#FFE8E8', color: '#D63031', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontWeight: 600 }}>⚠️ {error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'email', label: '📧 Email', type: 'email', placeholder: 'study@sync.com' },
            { key: 'password', label: '🔒 Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>{field.label}</label>
              <input className="input" type={field.type} placeholder={field.placeholder}
                value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? '⏳ Logging in...' : '📚 Let\'s Study!'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, color: '#888' }}>
          New here? <Link to="/register" style={{ color: '#6C63FF', fontWeight: 700 }}>Create account 🎉</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;