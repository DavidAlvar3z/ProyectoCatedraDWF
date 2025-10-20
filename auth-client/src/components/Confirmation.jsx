import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getPedidoById } from '../services/pedidoService';

export default function Confirmation() {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem('orderNumber');
    if (id) {
      getPedidoById(id)
        .then(setPedido)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando confirmación...</p>
        </motion.div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-6">No se pudo cargar la información del pedido.</p>
          <button
            onClick={() => navigate('/user')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header Success */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 text-center text-white relative overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <i className="fas fa-check-circle text-5xl"></i>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">¡Compra Exitosa!</h1>
            <p className="text-green-100 text-lg">Tu pedido ha sido procesado correctamente</p>

            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                  fill="white"
                  fillOpacity="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 mb-6 border-l-4 border-indigo-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    #{pedido.idPedido}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-receipt text-white text-2xl"></i>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shipping-fast text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Se enviará a:</h2>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-map-marker-alt text-indigo-500 mt-1"></i>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {pedido.direccion?.alias || 'Dirección principal'}
                      </p>
                      <p className="text-gray-600">{pedido.direccion?.calle}</p>
                      <p className="text-gray-600">
                        {pedido.direccion?.ciudad}, {pedido.direccion?.departamento}
                      </p>
                    </div>
                  </div>

                  {pedido.direccion?.latitud && pedido.direccion?.longitud && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${pedido.direccion.latitud}&mlon=${pedido.direccion.longitud}&zoom=15`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        <i className="fas fa-map"></i>
                        Ver en el mapa
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-info-circle text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Detalles del Pedido</h2>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${pedido.total?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Método de pago:</span>
                  <span className="font-semibold text-gray-800">{pedido.tipoPago}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Estado:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {pedido.estado}
                  </span>
                </div>

                {pedido.puntosTotales > 0 && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <i className="fas fa-star text-yellow-500"></i>
                      Puntos ganados:
                    </span>
                    <span className="text-xl font-bold text-yellow-600">
                      {pedido.puntosTotales}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate('/profile/user-orders')}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-list"></i>
                Ver mis pedidos
              </button>

              <button
                onClick={() => navigate('/user')}
                className="flex-1 py-3 px-6 border-2 border-indigo-300 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-home"></i>
                Volver al inicio
              </button>
            </motion.div>

            {/* Thank you message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                ¡Gracias por tu compra! Recibirás un correo de confirmación en breve.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
