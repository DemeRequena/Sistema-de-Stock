import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { Product, StockMovement } from '../types';
import './DashboardPage.css';

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [prods, movs] = await Promise.all([
        api<Product[]>('/products?activeOnly=true'),
        api<StockMovement[]>('/stock-movements'),
      ]);
      setProducts(prods);
      setMovements(movs);
    } catch (e: any) {
      setError(e?.message ?? 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const lowStock = useMemo(
    () => products.filter((p) => p.stockActual <= p.stockMinimo),
    [products],
  );

  const recent = useMemo(() => movements.slice(0, 5), [movements]);

  return (
    <div className="dash">
      <div className="dash-header">
        <h2>Dashboard</h2>
        <button className="secondary" onClick={load} disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="cards">
        <div className="card">
          <h3>Productos activos</h3>
          <p className="big">{products.length}</p>
        </div>

        <div className="card">
          <h3>Con stock bajo</h3>
          <p className="big">{lowStock.length}</p>
          <p className="hint">stockActual ≤ stockMinimo</p>
        </div>

        <div className="card">
          <h3>Movimientos totales</h3>
          <p className="big">{movements.length}</p>
        </div>
      </div>

      <div className="grid">
        <section className="card">
          <h3>Alertas de stock bajo</h3>
          {lowStock.length === 0 ? (
            <p className="hint">No hay productos en stock bajo 🎉</p>
          ) : (
            <ul className="list">
              {lowStock.map((p) => (
                <li key={p.id} className="list-item">
                  <span className="sku">{p.sku}</span>
                  <span>{p.name}</span>
                  <span className="right">
                    {p.stockActual} / min {p.stockMinimo}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3>Movimientos recientes</h3>
          {recent.length === 0 ? (
            <p className="hint">No hay movimientos todavía.</p>
          ) : (
            <ul className="list">
              {recent.map((m) => (
                <li key={m.id} className="list-item">
                  <span className={`pill ${m.type === 'OUT' ? 'pill-out' : 'pill-in'}`}>
                    {m.type}
                  </span>
                  <span>
                    {m.product.sku} · {m.product.name}
                  </span>
                  <span className="right">
                    {m.quantity} · {new Date(m.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
