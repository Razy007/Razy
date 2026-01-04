// Test minimaliste pour vérifier si React fonctionne
function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🎓 Pioneer Academy</h1>
        <p>Application TEST - Si vous voyez ce message, React fonctionne !</p>
        <p style={{ fontSize: '16px', marginTop: '20px', opacity: 0.8 }}>
          Version de test - 2025-12-31
        </p>
      </div>
    </div>
  );
}

export default App;
