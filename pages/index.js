// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    cost: "",
    stock: "",
  });

  async function load() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", sku: "", price: "", cost: "", stock: "" });
    load();
  }

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h1>🛒 Store Management - Products</h1>

      <form
        onSubmit={addProduct}
        style={{ marginBottom: 20, display: "grid", gap: 8 }}
      >
        <input
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="SKU"
          required
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          placeholder="Price"
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Cost"
          type="number"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
