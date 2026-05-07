import { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';

const Quiz = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subjectName: '', notes: '', numQuestions: 5 });
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [subRes, quizRes] = await Promise.all([API.get('/subjects'), API.get('/quiz')]);
        setSubjects(subRes.data);
        setHistory(quizRes.data.filter(q => q.completed));
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const generateQuiz = async (e) => {
    e.preventDefault(); setLoading(true); setQuiz(null); setResult(null); setAnswers({});
    try {
      const { data } = await API.post('/quiz/generate', form);
      setQuiz(data);
    } catch (err) { alert(err.response?.data?.message || 'Error generating quiz'); }
    finally { setLoading(false); }
  };

  const submitQuiz = async () => {
    try {
      const { data } = await API.post(`/quiz/submit/${quiz._id}`, { answers: Object.values(answers) });
      setResult(data);
    } catch (err) { console.error(err); }
  };

  const allAnswered = quiz && Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="page-container">
      <h1 className="page-title">🧠 AI Quiz Generator</h1>
      <p className="page-subtitle">Test your knowledge with AI-generated questions!</p>

      {!quiz && !loading && (
        <div className="card fade-in" style={{ maxWidth: 600, marginBottom: 30 }}>
          <h3 style={{ marginBottom: 20 }}>⚡ Generate a Quiz</h3>
          <form onSubmit={generateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>📖 Subject</label>
              <select className="input" value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} required>
                <option value="">Select a subject</option>
                {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                <option value="custom">✏️ Type custom subject</option>
              </select>
            </div>
            {form.subjectName === 'custom' && (
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>✏️ Custom Subject</label>
                <input className="input" placeholder="e.g. World History" onChange={e => setForm({ ...form, subjectName: e.target.value })} />
              </div>
            )}
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>📝 Your Notes (optional)</label>
              <textarea className="input" rows={3} placeholder="Paste your notes here for more relevant questions..."
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 6 }}>🔢 Number of Questions</label>
              <select className="input" value={form.numQuestions} onChange={e => setForm({ ...form, numQuestions: e.target.value })}>
                <option value={3}>3 questions</option>
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">🤖 Generate Quiz</button>
          </form>
        </div>
      )}

      {loading && <Loader text="AI is writing your quiz... 🧠" />}

      {quiz && !result && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2>📝 {quiz.subjectName} Quiz</h2>
            <span className="tag tag-purple">{Object.keys(answers).length}/{quiz.questions.length} answered</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {quiz.questions.map((q, i) => (
              <div key={i} className="card" style={{ border: answers[i] ? '2px solid #6C63FF' : '2px solid #E8E8FF' }}>
                <div style={{ fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>
                  Q{i + 1}. {q.question}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => setAnswers({ ...answers, [i]: opt })}
                      style={{
                        padding: '12px 16px', borderRadius: 12, border: '2px solid',
                        borderColor: answers[i] === opt ? '#6C63FF' : '#E8E8FF',
                        background: answers[i] === opt ? '#EEF0FF' : 'white',
                        color: answers[i] === opt ? '#6C63FF' : '#333',
                        fontWeight: answers[i] === opt ? 700 : 400,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        fontFamily: 'Space Grotesk'
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={submitQuiz} disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5, fontSize: '1.05rem', padding: '14px 36px' }}>
            {allAnswered ? '✅ Submit Quiz' : `Answer all ${quiz.questions.length} questions first`}
          </button>
        </div>
      )}

      {result && (
        <div className="card fade-in" style={{ maxWidth: 600, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>
            {result.score === result.total ? '🏆' : result.score >= result.total / 2 ? '👏' : '📖'}
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>
            {result.score}/{result.total} Correct!
          </h2>
          <div style={{ fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: 800, color: '#6C63FF', marginBottom: 8 }}>
            {Math.round(result.score / result.total * 100)}%
          </div>
          <p style={{ color: '#888', marginBottom: 24 }}>
            {result.score === result.total ? 'Perfect score! You nailed it! 🎯' : result.score >= result.total / 2 ? 'Good job! Keep studying! 💪' : 'Keep practicing, you\'ll get there! 📚'}
          </p>

          <div style={{ textAlign: 'left', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>📋 Answer Review:</h3>
            {result.questions.map((q, i) => (
              <div key={i} style={{ marginBottom: 12, padding: 14, borderRadius: 12, background: answers[i] === q.correct ? '#E8FFF6' : '#FFE8E8', border: `2px solid ${answers[i] === q.correct ? '#43D9A2' : '#FF5252'}` }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Q{i + 1}. {q.question}</div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  ✅ Correct: <strong>{q.correct}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>💡 {q.explanation}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => { setQuiz(null); setResult(null); setAnswers({}); }}>
            🔄 Take Another Quiz
          </button>
        </div>
      )}

      {history.length > 0 && !quiz && !result && (
        <div className="card" style={{ marginTop: 30 }}>
          <h3 style={{ marginBottom: 16 }}>📊 Quiz History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 5).map((q, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FAFAFF', borderRadius: 12, border: '2px solid #E8E8FF' }}>
                <span style={{ fontWeight: 700 }}>📖 {q.subjectName}</span>
                <span className={`tag ${q.score / q.total >= 0.7 ? 'tag-green' : 'tag-yellow'}`}>
                  {q.score}/{q.total} — {Math.round(q.score / q.total * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Quiz;