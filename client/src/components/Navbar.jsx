import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: '🏠 Home' },
    { to: '/subjects', label: '📚 Subjects' },
    { to: '/quiz', label: '🧠 Quiz' },
  ];

  return (
    <nav style={{
      background: 'white', padding: '0 30px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(108,99,255,0.1)',
      position: 'sticky', top: 0, zIndex: 100, height: 70
    }}>
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <h1 style={{ fontFamily: 'Poppins', fontSize: '1.6rem', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📚 StudySync
        </h1>
      </Link>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{
            textDecoration: 'none', padding: '8px 16px', borderRadius: 50,
            fontWeight: 700, fontSize: '0.9rem',
            color: location.pathname === link.to ? 'white' : '#555',
            background: location.pathname === link.to ? '#6C63FF' : 'transparent',
            transition: 'all 0.2s'
          }}>{link.label}</Link>
        ))}
        <span style={{ marginLeft: 8, fontWeight: 700, color: '#555' }}>👋 {user?.name}</span>
        <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;