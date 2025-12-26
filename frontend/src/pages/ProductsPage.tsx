import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { Product } from '../types';
import './ProductsPage.css';

type CreateProductForm = {
  name: string;
  description: string;
  sku: string;
  stockActual: number;
  stockMinimo: number;
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOnly, setActiveOnly] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateProductForm>({
    name: '',
    description: '',
    sku: '',
    stockActual: 0,
    stockMinimo: 0,
  });

  const lowStockSkus = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) {
      if (p.active && p.stockActual <= p.stockMinimo) s.add(p.sku);
    }
    return s;
  }, [products]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const qs = activeOnly ? '?activeOnly=true' : '';
      const data = await api<Product[]>(`/products${qs}`);
      setProducts(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error loading products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOnly]);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api<Product>('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          description: form.description || undefined,
          stockActual: Number(form.stockActual),
          stockMinimo: Number(form.stockMinimo),
        }),
      });
      setForm({ name: '', description: '', sku: '', stockActual: 0, stockMinimo: 0 });
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Error creating product');
    }
  }
  
async function toggleActive(id: number, active: boolean) {
  setError(null);
  try {
    await api(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
    await load();
  } catch (e: any) {
    setError(e?.message ?? 'Error updating product');
  }
}



  return (
    <div className="page">
      <div className="page-header">
        <h2>Productos</h2>

        <label className="toggle">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Solo activos
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        <section className="card">
          <h3>Crear producto (ADMIN)</h3>
          <p className="hint">
            Si te da 403, tu usuario es USER. Cambia role a ADMIN y vuelve a loguear.
          </p>

          <form className="form" onSubmit={createProduct}>
            <label>
              Nombre
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>

            <label>
              Descripción
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>

            <label>
              SKU
              <input
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                required
              />
            </label>

            <div className="row2">
              <label>
                Stock actual
                <input
                  type="number"
                  min={0}
                  value={form.stockActual}
                  onChange={(e) => setForm((f) => ({ ...f, stockActual: Number(e.target.value) }))}
                />
              </label>

              <label>
                Stock mínimo
                <input
                  type="number"
                  min={0}
                  value={form.stockMinimo}
                  onChange={(e) => setForm((f) => ({ ...f, stockMinimo: Number(e.target.value) }))}
                />
              </label>
            </div>

            <button type="submit">Crear</button>
          </form>
        </section>

        <section className="card">
          <div className="table-header">
            <h3>Listado</h3>
            <button className="secondary" onClick={load} disabled={loading}>
              {loading ? 'Cargando...' : 'Recargar'}
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Mín</th>
                  <th>Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className={`${lowStockSkus.has(p.sku) ? 'low' : ''} ${!p.active ? 'inactive' : ''}`}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.stockActual}</td>
                    <td>{p.stockMinimo}</td>
                    <td>{p.active ? 'Sí' : 'No'}</td>
                    <td className="actions">
                        {p.active ? (
                            <button className="danger" onClick={() => toggleActive(p.id, false)}>
                            Desactivar
                            </button>
                        ) : (
                            <button onClick={() => toggleActive(p.id, true)}>
                            Activar
                            </button>
                        )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty">
                      No hay productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="hint">
            Filas en rojo: stock actual ≤ stock mínimo.
          </p>
        </section>
      </div>
    </div>
  );
}
