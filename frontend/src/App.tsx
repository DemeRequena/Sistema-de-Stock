import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem('access_token'));
  }, []);

  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <div>
      <h1>Sistema de Gestión de Stock</h1>
      <button
        className="secondary"
        onClick={() => {
          localStorage.removeItem('access_token');
          setIsAuthed(false);
        }}
      >
        Cerrar sesión
      </button>

      <p>Login OK. Siguiente: Productos.</p>
    </div>
  );
}

export default App;
