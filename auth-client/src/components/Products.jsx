import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllProductosPaged,
  getRecommendedProductos
} from '../services/productoService';
import { addCarritoItem } from '../services/carritoItemService';
import MySwal from '../utils/swal';
import { CartContext } from '../context/CartContext';
import UserContext from '../context/UserContext';

export default function Products({ searchQuery = "" }) {
  const [allProductos, setAllProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const { carrito } = useContext(CartContext);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const loadPage = useCallback(async (pg = 0) => {
    setLoading(true);
    try {
      let recomendadosIds = [];
      if (userId) {
        const recs = await getRecommendedProductos(userId);
        recomendadosIds = recs.map(r => r.idProducto);
      }

      const res = await getAllProductosPaged(pg, size);
      const items = res.items.map(p => ({
        ...p,
        recomendado: recomendadosIds.includes(p.idProducto)
      }));

      setAllProductos(items);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
      await MySwal.fire('Error', 'No se pudieron cargar los productos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, size]);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const handleAdd = async p => {
    try {
      if (!carrito) throw new Error('Carrito no disponible');
      await addCarritoItem({
        idCarrito: carrito.idCarrito,
        idProducto: p.idProducto,
        cantidad: 1
      });
      await MySwal.fire('Agregado', `"${p.nombre}" añadido al carrito.`, 'success');
    } catch (err) {
      console.error(err);
      await MySwal.fire('Error', err.message || 'No se pudo añadir al carrito.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  const filtrados = allProductos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recomendados = filtrados.filter(p => p.recomendado);
  const sinRecomendados = filtrados.filter(p => !p.recomendado);
  const temporada = [...sinRecomendados]
    .sort((a, b) => b.precio - a.precio)
    .slice(0, 5);
  const restantes = sinRecomendados
    .filter(p => !temporada.some(t => t.idProducto === p.idProducto))
    .slice(0, 5);

  const renderCard = p => (
    <motion.div
      key={p.idProducto}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/producto/${p.idProducto}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 group relative"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={p.imagen}
          alt={p.nombre}
          className="w-full h-full object-cover"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); handleAdd(p); }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <i className="fas fa-shopping-cart"></i>
        </motion.button>
        {p.recomendado && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <i className="fas fa-star"></i>
            Recomendado
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {p.nombre}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ${p.precio.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <i className="fas fa-star text-sm"></i>
            <span className="text-sm font-semibold text-gray-700">4.5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12 py-8">
      <AnimatePresence>
        {recomendados.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-star text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Recomendados para ti</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recomendados.map(renderCard)}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-fire text-white text-xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Temporada</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {temporada.map(renderCard)}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-boxes text-white text-xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Otros productos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restantes.map(renderCard)}
        </div>
      </motion.section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => loadPage(page - 1)}
          disabled={page === 0 || loading}
          className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
            page === 0
              ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
              : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          <i className="fas fa-chevron-left"></i>
          Anterior
        </motion.button>
        <span className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg">
          {page + 1} / {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => loadPage(page + 1)}
          disabled={page + 1 >= totalPages || loading}
          className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
            page + 1 >= totalPages
              ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
              : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          Siguiente
          <i className="fas fa-chevron-right"></i>
        </motion.button>
      </div>
    </div>
  );
}