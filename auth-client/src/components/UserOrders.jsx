import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:8080/auth/pedido/user';

export default function UserOrders() {
  const { token, userData } = useContext(AuthContext);
  const userId = userData?.userId;
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_URL}/${userId}?page=${pageNum}&size=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error('Error al obtener pedidos');
      const data = await resp.json();
      const pedidos = data?._embedded?.pedidoResponseList || [];
      const filtered = pedidos.filter(
        p => p.estado !== 'ENTREGADO' && p.estado !== 'CANCELADO'
      );
      setOrders(Array.isArray(filtered) ? filtered : []);
      setPage(data?.page?.number ?? 0);
      setTotalPages(data?.page?.totalPages ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) fetchOrders(page);
    // eslint-disable-next-line
  }, [token, userId, page]);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-shopping-bag text-white text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos Activos</h1>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-box-open text-gray-400 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes pedidos activos</h3>
            <p className="text-gray-600">Tus pedidos aparecerán aquí una vez que realices una compra</p>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.li
                    key={order.idPedido}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-indigo-700">
                            Pedido #{order.idPedido}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                            order.estado === 'PAGADO' ? 'bg-blue-100 text-blue-800' :
                            order.estado === 'EN_PROCESO' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.estado}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600 flex items-center gap-2">
                            <i className="fas fa-calendar text-indigo-500 w-5"></i>
                            <strong>Fecha:</strong> {order.fechaInicio ? new Date(order.fechaInicio).toLocaleString() : '-'}
                          </p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <i className="fas fa-credit-card text-indigo-500 w-5"></i>
                            <strong>Pago:</strong> {order.tipoPago}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-indigo-600 mb-2">
                          ${order.total}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center justify-end gap-1">
                          <i className="fas fa-star text-yellow-500"></i>
                          <span>{order.puntosTotales} puntos</span>
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className={`px-4 py-2 rounded-l-lg border border-indigo-200 bg-white text-indigo-600 font-semibold transition
                  ${page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"}`}
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
                  ${page >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"}`}
              >
                Siguiente
                <i className="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}