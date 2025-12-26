import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { Product, StockMovement } from '../types';
import './MovementsPage.css';

type MovementForm = {
  productId: number | '';
  type: 'IN' | 'OUT';
  quantity: number;
};

export function MovementsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<MovementForm>({
    productId: '',
    type: 'IN',
    quantity: 1,
  });

  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products],
  );

  async function loadAll() {
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
      setError(e?.message ?? 'Error loading data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createMovement(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.productId === '') {
      setError('Selecciona un producto');
      return;
    }
    if (!Number.isFinite(form.quantity) || form.quantity < 1) {
      setError('Cantidad inválida (mínimo 1)');
      return;
    }

    try {
      await api('/stock-movements', {
        method: 'POST',
        body: JSON.stringify({
          productId: Number(form.productId),
          type: form.type,
          quantity: Number(form.quantity),
        }),
      });
      setForm((f) => ({ ...f, quantity: 1 }));
      await loadAll();
    } catch (e: any) {
      setError(e?.message ?? 'Error creating movement');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Movimientos de stock</h2>
        <button className="secondary" onClick={loadAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        <section className="card">
          <h3>Nuevo movimiento</h3>

          <form className="form" onSubmit={createMovement}>
            <label>
              Producto (solo activos)
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    productId: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
              >
                <option value="">-- Selecciona --</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} (stock: {p.stockActual})
                  </option>
                ))}
              </select>
            </label>

            <div className="row2">
              <label>
                Tipo
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value as 'IN' | 'OUT' }))
                  }
                >
                  <option value="IN">IN (Entrada)</option>
                  <option value="OUT">OUT (Salida)</option>
                </select>
              </label>

              <label>
                Cantidad
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                  }
                />
              </label>
            </div>

            <button type="submit">Guardar movimiento</button>

            <p className="hint">
              Si intentas OUT con más cantidad de la disponible, el backend responde 400.
            </p>
          </form>
        </section>

        <section className="card">
          <h3>Historial (recientes)</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                    <td>
                      {m.product.sku} - {m.product.name}
                    </td>
                    <td className={m.type === 'OUT' ? 'out' : 'in'}>{m.type}</td>
                    <td>{m.quantity}</td>
                    <td>{m.user.email}</td>
                  </tr>
                ))}

                {movements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      No hay movimientos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
