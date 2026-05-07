const Loader = ({ text = "Loading..." }) => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div style={{
      width: 48, height: 48, border: '5px solid #E8E8FF',
      borderTop: '5px solid #6C63FF', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
    }} />
    <p style={{ color: '#888', fontWeight: 600 }}>{text}</p>
  </div>
);
export default Loader;