import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [subRes, quizRes] = await Promise.all([API.get('/subjects'), API.get('/quiz')]);
        setSubjects(subRes.data);
        setQuizzes(quizRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getDaysLeft = (examDate) => {
    const diff = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const avgScore = quizzes.filter(q => q.completed).length > 0
    ? Math.round(quizzes.filter(q => q.completed).reduce((s, q) => s + (q.score / q.total * 100), 0) / quizzes.filter(q => q.completed).length)
    : 0;

  if (loading) return <Loader text="Loading your study hub... 📚" />;

  return (
    <div className="page-container">
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', borderRadius: 24, padding: '36px 40px', marginBottom: 36, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '5rem', position: 'absolute', right: 30, top: -10, opacity: 0.2 }}>🎓</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>Hey {user?.name}! 👋</h1>
        <p style={{ opacity: 0.9 }}>Ready to crush those exams? Let's go! 💪</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 36 }}>
        {[
          { emoji: '📚', label: 'Subjects', value: subjects.length, color: '#EEF0FF' },
          { emoji: '🧠', label: 'Quizzes Taken', value: quizzes.length, color: '#E8FFF6' },
          { emoji: '⭐', label: 'Avg Quiz Score', value: `${avgScore}%`, color: '#FFF8E1' },
        ].map((card, i) => (
          <div key={i} className="card fade-in" style={{ textAlign: 'center', background: card.color, animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{card.emoji}</div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Poppins', fontWeight: 800, color: '#1A1A2E' }}>{card.value}</div>
            <div style={{ color: '#888', fontWeight: 600 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {subjects.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 20 }}>⏰ Upcoming Exams</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {subjects.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).slice(0, 4).map(sub => {
              const days = getDaysLeft(sub.examDate);
              return (
                <div key={sub._id} onClick={() => navigate('/subjects')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#FAFAFF', borderRadius: 12, cursor: 'pointer', border: '2px solid #E8E8FF' }}>
                  <div style={{ fontWeight: 700 }}>📖 {sub.name}</div>
                  <span className={`tag ${days <= 3 ? 'tag-red' : days <= 7 ? 'tag-yellow' : 'tag-green'}`}>
                    {days <= 0 ? '⚠️ Today!' : `${days} days left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: 20 }}>🚀 Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/subjects" className="btn btn-primary" style={{ textDecoration: 'none' }}>➕ Add Subject</a>
          <a href="/quiz" className="btn btn-secondary" style={{ textDecoration: 'none' }}>🧠 Take a Quiz</a>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;