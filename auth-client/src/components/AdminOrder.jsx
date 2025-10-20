import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getAllPedidos } from '../services/pedidoService';

export default function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    getAllPedidos(page, 10)
      .then(result => {
        setOrders(result.items || []);
        setPage(result.page ?? 0);
        setTotalPages(result.totalPages ?? 1);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, page]);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <i className="fas fa-clipboard-list text-white text-xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Todos los Pedidos</h2>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-600">No hay pedidos registrados.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.idPedido}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-indigo-700">
                        #{order.idPedido}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.estado === 'ENTREGADO'
                            ? 'bg-green-100 text-green-800'
                            : order.estado === 'CANCELADO'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.estado}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <i className="fas fa-user w-5 text-indigo-500"></i>
                        <strong className="ml-2">Usuario:</strong>{' '}
                        {order.nombreUsuario || 'Desconocido'}
                      </p>
                      <p className="text-gray-600">
                        <i className="fas fa-calendar w-5 text-indigo-500"></i>
                        <strong className="ml-2">Fecha:</strong>{' '}
                        {order.fechaInicio
                          ? new Date(order.fechaInicio).toLocaleString()
                          : '-'}
                      </p>
                      <p className="text-gray-600">
                        <i className="fas fa-credit-card w-5 text-indigo-500"></i>
                        <strong className="ml-2">Pago:</strong> {order.tipoPago}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600 mb-2">
                      ${order.total}
                    </p>
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      {order.puntosTotales} puntos
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className={`px-4 py-2 rounded-l-lg border border-indigo-200 bg-white text-indigo-600 font-semibold transition
                ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Anterior
            </button>

            <span className="px-4 py-2 bg-indigo-50 border-t border-b border-indigo-200 text-indigo-700 font-medium">
              Página {page + 1} de {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              className={`px-4 py-2 rounded-r-lg border border-indigo-200 bg-white text-indigo-600 font-semibold transition
                ${
                  page >= totalPages - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-50'
                }`}
            >
              Siguiente
              <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
