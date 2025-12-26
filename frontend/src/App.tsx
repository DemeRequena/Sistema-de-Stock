import { useEffect, useMemo, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { MovementsPage } from './pages/MovementsPage';

import type { Role } from './types';
import { clearToken, getRoleFromToken, getToken, isTokenExpired } from './lib/auth';

import './App.css';
import './Nav.css';

type Tab = 'dashboard' | 'products' | 'movements';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [tab, setTab] = useState<Tab>('dashboard');

  function refreshAuthState() {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      clearToken();
      setIsAuthed(false);
      setRole(null);
      return;
    }

    setIsAuthed(true);
    setRole(getRoleFromToken(token));
  }

  useEffect(() => {
    refreshAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdmin = useMemo(() => role === 'ADMIN', [role]);

  if (!isAuthed) {
    return <LoginPage onLogin={refreshAuthState} />;
  }

  return (
    <>
      <header className="app-header">
        <div className="app-title-wrap">
          <h1 className="app-title">Sistema de Gestión de Stock</h1>
          <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
            {role ?? 'UNKNOWN'}
          </span>
        </div>

        <button
          className="secondary"
          onClick={() => {
            clearToken();
            setIsAuthed(false);
            setRole(null);
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <nav className="nav">
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>
          Dashboard
        </button>

        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
          Productos
        </button>

        <button
          className={tab === 'movements' ? 'active' : ''}
          onClick={() => setTab('movements')}
        >
          Movimientos
        </button>

        {/* Cuando implementemos Users, lo mostramos solo a ADMIN */}
        {/* {isAdmin && <button ...>Usuarios</button>} */}
      </nav>

      <main className="app-content">
        {tab === 'dashboard' ? (
          <DashboardPage />
        ) : tab === 'products' ? (
          <ProductsPage isAdmin={isAdmin} />
        ) : (
          <MovementsPage />
        )}
      </main>
    </>
  );
}

export default App;
