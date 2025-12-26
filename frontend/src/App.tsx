import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { MovementsPage } from './pages/MovementsPage';
import './App.css';
import './Nav.css';

type Tab = 'products' | 'movements';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('products');

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

      <nav className="nav">
        <button
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Productos
        </button>
        <button
          className={tab === 'movements' ? 'active' : ''}
          onClick={() => setTab('movements')}
        >
          Movimientos
        </button>
      </nav>

      <main className="app-content">
        {tab === 'products' ? <ProductsPage /> : <MovementsPage />}
      </main>
    </>
  );
}

export default App;
