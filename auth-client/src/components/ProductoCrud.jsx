import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProductosPaged, createProducto, updateProducto, deleteProducto } from "../services/productoService";
import { AuthContext } from "../context/AuthContext";

export default function ProductoCrud() {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState(null);
  const [size] = useState(10);
  const [search, setSearch] = useState("");

  const { userData } = useContext(AuthContext);
  const roles = Array.isArray(userData?.roles) ? userData.roles : [userData?.roles];
  const isAdmin = roles.includes("ROLE_ADMIN");

  const fetchProductos = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllProductosPaged(pageNum, size);
      setProductos(result.items || []);
      setPage(result.page ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(page);
    // eslint-disable-next-line
  }, [page, size]);

  const handleEdit = (producto) => {
    if (!isAdmin) return;
    setEditProducto(producto);
    setModalOpen(true);
  };

  const handleAdd = () => {
    if (!isAdmin) return;
    setEditProducto(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProducto(id);
      fetchProductos(page);
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const filtered = search
    ? productos.filter(p =>
        (p.nombre || "").toLowerCase().includes(search.toLowerCase())
      )
    : productos;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-boxes text-white text-xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            onClick={handleAdd}
          >
            <i className="fas fa-plus"></i>
            Agregar Producto
          </motion.button>
        )}
      </div>

      <div className="mb-6 flex justify-end">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
            <p className="text-gray-600">No hay productos registrados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-teal-50">
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-hashtag mr-2 text-green-500"></i>ID
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-tag mr-2 text-green-500"></i>Nombre
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-align-left mr-2 text-green-500"></i>Descripción
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-dollar-sign mr-2 text-green-500"></i>Precio
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-money-bill mr-2 text-green-500"></i>Costo
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-warehouse mr-2 text-green-500"></i>Stock
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-image mr-2 text-green-500"></i>Imagen
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-star mr-2 text-green-500"></i>Puntos
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-layer-group mr-2 text-green-500"></i>Tipo
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-cog mr-2 text-green-500"></i>Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((producto, index) => (
                      <motion.tr
                        key={producto.idProducto}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-green-50/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-green-600">#{producto.idProducto}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">{producto.nombre}</td>
                        <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{producto.descripcion}</td>
                        <td className="py-4 px-6">
                          <span className="text-lg font-bold text-green-600">${producto.precio}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">${producto.costo}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            producto.cantidad > 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {producto.cantidad}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {producto.imagen && (
                            <img 
                              src={producto.imagen} 
                              alt={producto.nombre} 
                              className="w-16 h-16 object-cover rounded-lg shadow-md" 
                            />
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                            <i className="fas fa-star"></i>
                            {producto.cantidadPuntos}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {producto.nombreTipo || producto.tipoProducto?.nombre || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-9 h-9 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleEdit(producto)}
                              disabled={!isAdmin}
                              title={isAdmin ? "Editar producto" : "Solo el administrador puede editar"}
                            >
                              <i className="fas fa-edit"></i>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-9 h-9 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDelete(producto.idProducto)}
                              disabled={!isAdmin}
                              title={isAdmin ? "Eliminar producto" : "Solo el administrador puede eliminar"}
                            >
                              <i className="fas fa-trash"></i>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={page === 0}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
                  page === 0
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                <i className="fas fa-chevron-left"></i>
                Anterior
              </motion.button>
              <span className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold shadow-lg">
                {page + 1} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={page >= totalPages - 1}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
                  page >= totalPages - 1
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                Siguiente
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && isAdmin && (
          <ProductoModal
            producto={editProducto}
            onClose={() => setModalOpen(false)}
            onSave={async prod => {
              if (prod.idProducto) await updateProducto(prod.idProducto, prod);
              else await createProducto(prod);
              setModalOpen(false);
              fetchProductos(page);
            }}
            tiposProducto={[]}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProductoModal({ producto, onClose, onSave, tiposProducto }) {
  const [form, setForm] = useState(
    producto || {
      nombre: "",
      descripcion: "",
      precio: "",
      costo: "",
      cantidad: "",
      imagen: "",
      cantidadPuntos: "",
      idTipoProducto: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    setForm({ ...form, idTipoProducto: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <i className={`fas ${form.idProducto ? 'fa-edit' : 'fa-plus'} text-white text-xl`}></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {form.idProducto ? "Editar Producto" : "Nuevo Producto"}
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <i className="fas fa-times"></i>
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <i className="fas fa-tag mr-2 text-green-500"></i>Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <i className="fas fa-align-left mr-2 text-green-500"></i>Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-dollar-sign mr-2 text-green-500"></i>Precio
              </label>
              <input
                name="precio"
                type="number"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-money-bill mr-2 text-green-500"></i>Costo
              </label>
              <input
                name="costo"
                type="number"
                step="0.01"
                value={form.costo}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-warehouse mr-2 text-green-500"></i>Stock
              </label>
              <input
                name="cantidad"
                type="number"
                value={form.cantidad}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-star mr-2 text-yellow-500"></i>Puntos
              </label>
              <input
                name="cantidadPuntos"
                type="number"
                value={form.cantidadPuntos}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <i className="fas fa-image mr-2 text-green-500"></i>Imagen (URL)
            </label>
            <input
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <i className="fas fa-layer-group mr-2 text-green-500"></i>Tipo de Producto
            </label>
            <select
              name="idTipoProducto"
              value={form.idTipoProducto}
              onChange={handleTipoChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tiposProducto && tiposProducto.map(tp => (
                <option key={tp.idTipoProducto} value={tp.idTipoProducto}>
                  {tp.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
            >
              <i className="fas fa-save mr-2"></i>
              Guardar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}