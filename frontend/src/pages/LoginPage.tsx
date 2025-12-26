import { useState } from 'react';
import { api } from '../lib/api';
import './LoginPage.css';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('access_token', data.access_token);
      onLogin();
    } catch (err: any) {
      setError(err?.message ?? 'Login error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}
