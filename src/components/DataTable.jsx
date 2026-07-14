import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../services/Api";
import ConfirmModal from "./ConfirmModal";

function DataTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState({ abierto: false, tipo: null, producto: null });

  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({ title: "", price: "", category: "", stock: "" });

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const query = searchParams.get("q") || "";
  const categoria = searchParams.get("category") || "";
  const skip = (page - 1) * limit;

  useEffect(() => {
    getCategories().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    cargar();
  }, [page, limit, query, categoria]);

  async function cargar() {
    try {
      setCargando(true);
      setError(null);
      const data = await fetchProducts({ limit, skip, search: query, category: categoria });
      setProductos(data.products);
      setTotal(data.total);
    } catch (err) {
      setError("No se pudieron cargar los productos. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function actualizarParams(nuevos) {
    setSearchParams({ page: 1, limit, q: query, category: categoria, ...nuevos });
  }

  function irPagina(nuevaPagina) {
    setSearchParams({ page: nuevaPagina, limit, q: query, category: categoria });
  }

  const totalPaginas = Math.ceil(total / limit);

  function abrirNuevo() {
    setProductoEditando(null);
    setFormData({ title: "", price: "", category: "", stock: "" });
    setMostrarForm(true);
  }

  function abrirEditar(producto) {
    setProductoEditando(producto);
    setFormData({
      title: producto.title,
      price: producto.price,
      category: producto.category,
      stock: producto.stock,
    });
    setMostrarForm(true);
  }

  function guardarProducto(e) {
  e.preventDefault();
  if (!formData.title || !formData.price) return;

  if (productoEditando) {
    setConfirmacion({ abierto: true, tipo: "editar", producto: productoEditando });
  } else {
    setConfirmacion({ abierto: true, tipo: "crear", producto: null });
  }
}

  function eliminarProducto(producto) {
  setConfirmacion({ abierto: true, tipo: "eliminar", producto });
}

  function getStockBadge(stock) {
    if (stock < 10) return <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">Stock bajo ({stock})</span>;
    if (stock < 50) return <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">Disponible ({stock})</span>;
    return <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">En stock ({stock})</span>;
  }

  async function confirmarAccion() {
  const { tipo, producto } = confirmacion;

  if (tipo === "crear") {
    try {
      const nuevo = await createProduct(formData);
      setProductos((prev) => [{ ...nuevo, thumbnail: nuevo.thumbnail || "https://placehold.co/60" }, ...prev]);
      setMostrarForm(false);
    } catch {
      // opcional: manejo de error
    }
  }

  if (tipo === "editar") {
    try {
      await updateProduct(producto.id, formData);
      setProductos((prev) => prev.map((p) => (p.id === producto.id ? { ...p, ...formData } : p)));
      setMostrarForm(false);
    } catch {
      // opcional: manejo de error
    }
  }

  if (tipo === "eliminar") {
    try {
      await deleteProduct(producto.id);
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    } catch {
      // opcional: manejo de error
    }
  }

  setConfirmacion({ abierto: false, tipo: null, producto: null });
}


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-md shadow-green-200">S</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">StopOver · Productos</h1>
            <p className="text-sm text-gray-500">Explora el catálogo disponible</p>
          </div>
        </div>
        <button
          onClick={abrirNuevo}
          className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700"
        >
          + Agregar producto
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar producto..."
          defaultValue={query}
          onChange={(e) => actualizarParams({ q: e.target.value, category: "" })}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={categoria}
          onChange={(e) => actualizarParams({ category: e.target.value, q: "" })}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.slug || cat} value={cat.slug || cat}>
              {cat.name || cat}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => actualizarParams({ limit: e.target.value, page: 1 })}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm"
        >
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={40}>40 por página</option>
          <option value={50}>50 por página</option>
        </select>
      </div>

      {mostrarForm && (
        <form onSubmit={guardarProducto} className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500">Nombre</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm block"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Precio</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm block"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Categoría</label>
            <input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm block"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm block"
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Guardar
          </button>
          <button type="button" onClick={() => setMostrarForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300">
            Cancelar
          </button>
        </form>
      )}

      {cargando ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Existencias</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productos.map((producto) => (
                  <tr key={producto.id} className="group hover:bg-green-50/60 transition-all duration-200">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={producto.thumbnail}
                          alt={producto.title}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="text-gray-900 font-medium">{producto.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {producto.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold">${producto.price}</td>
                    <td className="px-5 py-4">{getStockBadge(producto.stock)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => abrirEditar(producto)} className="text-blue-600 text-xs font-semibold hover:underline">
                          Editar
                        </button>
                        <button onClick={() => eliminarProducto(producto)} className="text-red-600 text-xs font-semibold hover:underline">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500">Página {page} de {totalPaginas || 1} · {total} resultados</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => irPagina(page - 1)} className="px-4 py-2 text-sm rounded-xl border border-gray-300 disabled:opacity-40">Anterior</button>
              <button disabled={page >= totalPaginas} onClick={() => irPagina(page + 1)} className="px-4 py-2 text-sm rounded-xl border border-gray-300 disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
  abierto={confirmacion.abierto}
  titulo={
    confirmacion.tipo === "eliminar"
      ? "Eliminar producto"
      : confirmacion.tipo === "crear"
      ? "Agregar producto"
      : "Confirmar edición"
  }
  mensaje={
    confirmacion.tipo === "eliminar"
      ? `¿Seguro que quieres eliminar "${confirmacion.producto?.title}"? Esta acción no se puede deshacer.`
      : confirmacion.tipo === "crear"
      ? `¿Seguro que quieres agregar "${formData.title}" al catálogo?`
      : `¿Seguro que quieres guardar los cambios de "${confirmacion.producto?.title}"?`
  }
  onConfirmar={confirmarAccion}
  onCancelar={() => setConfirmacion({ abierto: false, tipo: null, producto: null })}
/>
    </div>
  );
}

export default DataTable;