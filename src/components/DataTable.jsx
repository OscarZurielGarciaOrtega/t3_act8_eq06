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
    <div className="p-4 sm:p-6 w-full">
      {/* Encabezado original con botón de agregar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-md shadow-green-200">S</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">StopOver · Productos</h1>
            <p className="text-xs text-gray-500">Explora el catálogo disponible</p>
          </div>
        </div>
        <button
          onClick={abrirNuevo}
          className="bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm shrink-0"
        >
          + Agregar producto
        </button>
      </div>

      {/* Contenedor de filtros ordenado y sin empalmar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar producto..."
            defaultValue={query}
            onChange={(e) => actualizarParams({ q: e.target.value, category: "" })}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-[180px] focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
          <select
            value={categoria}
            onChange={(e) => actualizarParams({ category: e.target.value, q: "" })}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-green-600 cursor-pointer"
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
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-green-600 cursor-pointer"
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={40}>40 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>

      {/* Formulario de Alta/Edición */}
      {mostrarForm && (
        <form onSubmit={guardarProducto} className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex flex-wrap gap-3 items-end shadow-sm">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-full block focus:outline-none focus:border-green-600"
              required
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Precio</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-full block focus:outline-none focus:border-green-600"
              required
            />
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
            <input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-full block focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-gray-500 mb-1 block">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-full block focus:outline-none focus:border-green-600"
            />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors">
            Guardar
          </button>
          <button type="button" onClick={() => setMostrarForm(false)} className="px-4 py-1.5 rounded-lg text-xs border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </form>
      )}

      {/* Tabla Principal */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white rounded-2xl border border-gray-200">
          <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-xs">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <span>⚠️</span> {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Existencias</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-green-50/40 transition-colors">
                    <td className="px-4 py-3 max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <img 
                          src={producto.thumbnail || producto.images?.[0]} 
                          alt="" 
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0 shadow-sm" 
                        />
                        <span className="text-gray-900 font-medium truncate">{producto.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-orange-100 text-orange-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize">
                        {producto.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold whitespace-nowrap">${producto.price}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStockBadge(producto.stock)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => abrirEditar(producto)} 
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors shadow-sm"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => eliminarProducto(producto)} 
                          className="px-2.5 py-1 text-[11px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors shadow-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">Página {page} de {totalPaginas || 1} · {total} resultados</p>
            <div className="flex gap-1.5">
              <button disabled={page <= 1} onClick={() => irPagina(page - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors">Anterior</button>
              <button disabled={page >= totalPaginas} onClick={() => irPagina(page + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors">Siguiente</button>
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