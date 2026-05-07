import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';

const diffColors = { easy: 'tag-green', medium: 'tag-yellow', hard: 'tag-red' };

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [form, setForm] = useState({ name: '', examDate: '', difficulty: 'medium', hoursPerDay: 2, topics: '' });
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try { const { data } = await API.get('/subjects'); setSubjects(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const topics = form.topics.split(',').map(t => ({ name: t.trim(), done: false })).filter(t => t.name);
      await API.post('/subjects', { ...form, topics });
      setForm({ name: '', examDate: '', difficulty: 'medium', hoursPerDay: 2, topics: '' });
      setShowForm(false); fetchSubjects();
    } catch (err) { console.error(err); }
  };

  const handleGeneratePlan = async (subjectId) => {
    setGenerating(subjectId);
    try {
      await API.post(`/plans/generate/${subjectId}`);
      navigate(`/plan/${subjectId}`);
    } catch (err) { alert(err.response?.data?.message || 'Error generating plan'); }
    finally { setGenerating(null); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/subjects/${id}`); setSubjects(subjects.filter(s => s._id !== id)); }
    catch (err) { console.error(err); }
  };

  const getDaysLeft = (examDate) => Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));

  const getProgress = (subject) => {
    if (!subject.topics.length) return 0;
    return Math.round((subject.topics.filter(t => t.done).length / subject.topics.length) * 100);
  };

  if (loading) return <Loader text="Loading subjects... 📖" />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
        <div>
          <h1 className="page-title">📚 My Subjects</h1>
          <p className="page-subtitle">{subjects.length} subject{subjects.length !== 1 ? 's' : ''} to conquer</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Subject'}
        </button>
      </div>

      {showForm && (
        <div className="card fade-in" style={{ marginBottom: 30, background: '#FAFAFF', border: '2px solid #E8E8FF' }}>
          <h3 style={{ marginBottom: 20 }}>➕ New Subject</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              {[
                { key: 'name', label: '📖 Subject Name', type: 'text', placeholder: 'Mathematics' },
                { key: 'examDate', label: '📅 Exam Date', type: 'date', placeholder: '' },
                { key: 'hoursPerDay', label: '⏱️ Hours/Day', type: 'number', placeholder: '2' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required={f.key !== 'hoursPerDay'} />
                </div>
              ))}
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>⚡ Difficulty</label>
                <select className="input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>📝 Topics (comma separated)</label>
              <input className="input" placeholder="Algebra, Calculus, Trigonometry, Statistics" value={form.topics}
                onChange={e => setForm({ ...form, topics: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">✅ Add Subject</button>
          </form>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="empty-state card">
          <span className="emoji">😴</span>
          <h3>No subjects yet!</h3>
          <p>Add a subject and let AI create your study plan 🤖</p>
        </div>
      ) : (
        <div className="grid-2">
          {subjects.map((sub, i) => {
            const days = getDaysLeft(sub.examDate);
            const progress = getProgress(sub);
            return (
              <div key={sub._id} className="card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.2rem' }}>📖 {sub.name}</h3>
                  <button className="btn btn-danger" onClick={() => handleDelete(sub._id)}>🗑️</button>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span className={`tag ${diffColors[sub.difficulty]}`}>{sub.difficulty}</span>
                  <span className={`tag ${days <= 3 ? 'tag-red' : days <= 7 ? 'tag-yellow' : 'tag-green'}`}>
                    {days <= 0 ? '⚠️ Today!' : `📅 ${days} days left`}
                  </span>
                  <span className="tag tag-purple">⏱️ {sub.hoursPerDay}h/day</span>
                </div>

                {sub.topics.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem', fontWeight: 700 }}>
                      <span>📋 Progress</span><span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {sub.topics.slice(0, 4).map(t => (
                        <span key={t._id} className={`tag ${t.done ? 'tag-green' : 'tag-purple'}`}>
                          {t.done ? '✅' : '📌'} {t.name}
                        </span>
                      ))}
                      {sub.topics.length > 4 && <span className="tag tag-yellow">+{sub.topics.length - 4} more</span>}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
                    onClick={() => handleGeneratePlan(sub._id)} disabled={generating === sub._id}>
                    {generating === sub._id ? '🤖 Generating...' : '🗓️ AI Study Plan'}
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
                    onClick={() => navigate(`/plan/${sub._id}`)}>
                    👁️ View Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Subjects;