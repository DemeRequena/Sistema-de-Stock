import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import './App.css';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem('access_token'));
  }, []);

  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Sistema de Gestión de Stock</h1>
        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem('access_token');
            setIsAuthed(false);
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="app-content">
        <ProductsPage />
      </main>
    </>
  );
}

export default App;
