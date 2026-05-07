import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';

const StudyPlan = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try { const { data } = await API.get(`/plans/${subjectId}`); setPlan(data); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchPlan();
  }, [subjectId]);

  const toggleDay = async (dayIndex) => {
    try {
      const { data } = await API.patch(`/plans/${subjectId}/day/${dayIndex}`);
      setPlan(data);
    } catch (err) { console.error(err); }
  };

  const completed = plan?.plan.filter(d => d.completed).length || 0;
  const total = plan?.plan.length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) return <Loader text="Loading your study plan... 📅" />;

  if (!plan) return (
    <div className="page-container">
      <div className="empty-state card">
        <span className="emoji">📭</span>
        <h3>No study plan yet!</h3>
        <p>Go to Subjects and click "AI Study Plan" to generate one 🤖</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/subjects')}>
          Go to Subjects
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: 30 }}>
        <button onClick={() => navigate('/subjects')} style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 700, cursor: 'pointer', marginBottom: 12, fontSize: '0.95rem' }}>
          ← Back to Subjects
        </button>
        <h1 className="page-title">🗓️ {plan.subjectName} Study Plan</h1>
        <p className="page-subtitle">{completed}/{total} days completed</p>
        <div className="progress-bar" style={{ maxWidth: 400 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#888', fontWeight: 600 }}>{progress}% complete 🎯</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plan.plan.map((day, i) => (
          <div key={i} className={`card fade-in`} style={{
            border: `2px solid ${day.completed ? '#43D9A2' : '#E8E8FF'}`,
            background: day.completed ? '#E8FFF6' : 'white',
            animationDelay: `${i * 0.05}s`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.1rem', color: day.completed ? '#1B9E6E' : '#6C63FF' }}>
                    Day {day.day}
                  </span>
                  <span className="tag tag-purple">📅 {day.date}</span>
                  <span className="tag tag-yellow">⏱️ {day.hours}h</span>
                  {day.completed && <span className="tag tag-green">✅ Done!</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {day.topics.map((topic, j) => (
                    <span key={j} style={{ background: '#EEF0FF', color: '#6C63FF', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                      📌 {topic}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => toggleDay(i)} className={`btn ${day.completed ? 'btn-green' : 'btn-primary'}`}
                style={{ marginLeft: 16, padding: '10px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                {day.completed ? '✅ Done' : '☑️ Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StudyPlan;