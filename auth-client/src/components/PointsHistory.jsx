import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getHistorialPuntosByUser } from '../services/historialPuntosService';

export default function PointsHistory() {
  const { userData, token } = useContext(AuthContext);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!token || !userData?.userId) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }
      try {
        const data = await getHistorialPuntosByUser(userData.userId, page, size);
        const historial = data._embedded?.historialPuntosResponseList || [];
        setPointsHistory(historial);
        setTotalPages(data.page?.totalPages || 1);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPointsHistory([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchPointsHistory();
  }, [token, userData, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de puntos...</p>
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
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-star text-white text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Historial de Puntos</h1>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        {pointsHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-coins text-yellow-500 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No hay historial de puntos</h3>
            <p className="text-gray-600">Realiza compras para comenzar a acumular puntos</p>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              <AnimatePresence>
                {pointsHistory.map((entry, index) => {
                  const puntosCambiados = entry.cantidadNueva - entry.cantidadAnterior;
                  const isPositive = puntosCambiados > 0;
                  
                  return (
                    <motion.li
                      key={entry.idHistorialPuntos}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-2 rounded-xl p-6 hover:shadow-md transition-all duration-300 ${
                        isPositive ? 'border-green-100 hover:border-green-200' : 'border-red-100 hover:border-red-200'
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isPositive ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <i className={`fas ${isPositive ? 'fa-plus' : 'fa-minus'} ${
                                isPositive ? 'text-green-600' : 'text-red-600'
                              }`}></i>
                            </div>
                            <span className="text-xl font-bold text-gray-800">
                              {entry.fecha ? new Date(entry.fecha).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : '-'}
                            </span>
                          </div>
                          <div className="space-y-2 ml-13">
                            <p className="text-gray-600">
                              <strong>Puntos Anteriores:</strong> <span className="font-mono">{entry.cantidadAnterior}</span>
                            </p>
                            <p className="text-gray-600">
                              <strong>Puntos Nuevos:</strong> <span className="font-mono">{entry.cantidadNueva}</span>
                            </p>
                            {entry.idPedido && (
                              <p className="text-gray-600">
                                <i className="fas fa-shopping-bag text-indigo-500 mr-2"></i>
                                <strong>Pedido:</strong> #{entry.idPedido}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isPositive ? '+' : ''}{puntosCambiados}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {isPositive ? 'Puntos ganados' : 'Puntos usados'}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className={`px-4 py-2 rounded-l-lg border border-yellow-200 bg-white text-yellow-600 font-semibold transition
                  ${page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-50"}`}
              >
                <i className="fas fa-chevron-left mr-2"></i>
                Anterior
              </button>
              <span className="px-4 py-2 bg-yellow-50 border-t border-b border-yellow-200 text-yellow-700 font-medium">
                Página {page + 1} de {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-4 py-2 rounded-r-lg border border-yellow-200 bg-white text-yellow-600 font-semibold transition
                  ${page + 1 >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-50"}`}
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