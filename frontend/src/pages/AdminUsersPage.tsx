import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { getRoleFromToken, getToken } from '../lib/auth';

export function AdminUsersPage({ onUnauthorized }: { onUnauthorized?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const roleFromToken = getRoleFromToken(token);
    if (roleFromToken !== 'ADMIN') {
      // Notify parent to hide/redirect if the user is not admin
      onUnauthorized?.();
    }
  }, [onUnauthorized]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await api('/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      setMsg('Usuario creado correctamente');
      setEmail('');
      setPassword('');
      setRole('USER');
    } catch (err: any) {
      setMsg(err?.message ?? 'Error');
    }
  }

  return (
    <div>
      <h2>Crear usuario</h2>
      <form onSubmit={submit} className="form">
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div>
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div>
          <button type="submit">Crear</button>
        </div>

        {msg && <div className="message">{msg}</div>}
      </form>
    </div>
  );
}
