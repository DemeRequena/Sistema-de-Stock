import { useEffect, useMemo, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { MovementsPage } from './pages/MovementsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

import type { Role } from './types';
import { clearToken, getRoleFromToken, getToken, isTokenExpired } from './lib/auth';

import './App.css';
import './Nav.css';

type Tab = 'dashboard' | 'products' | 'movements' | 'users';

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
            setTab('dashboard'); // reset tab on logout to avoid showing stale admin screens
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

        {isAdmin && (
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
            Usuarios
          </button>
        )}
      </nav>

      <main className="app-content">
        {tab === 'dashboard' ? (
          <DashboardPage />
        ) : tab === 'products' ? (
          <ProductsPage isAdmin={isAdmin} />
        ) : tab === 'movements' ? (
          <MovementsPage />
        ) : tab === 'users' ? (
          isAdmin ? (
            <AdminUsersPage onUnauthorized={() => setTab('dashboard')} />
          ) : (
            // If somehow a non-admin has the users tab selected, fall back to dashboard
            <DashboardPage />
          )
        ) : (
          <DashboardPage />
        )}
      </main>
    </>
  );
}

export default App;
