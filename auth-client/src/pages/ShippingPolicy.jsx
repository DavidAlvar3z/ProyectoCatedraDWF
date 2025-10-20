import React from 'react';
import { motion } from 'framer-motion';

export default function ShippingPolicy() {
  const shippingInfo = [
    {
      icon: "fas fa-truck",
      title: "Opciones de envío",
      description: "Ofrecemos envío estándar (3–5 días hábiles) y exprés (1–2 días hábiles) dentro de El Salvador.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "fas fa-map-marked-alt",
      title: "Zonas de cobertura",
      description: "Realizamos entregas en todo el territorio nacional. Algunas zonas rurales pueden requerir tiempo adicional.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: "fas fa-dollar-sign",
      title: "Costos",
      description: "El costo de envío varía según el peso, tamaño del paquete y destino. El monto se calcula automáticamente al finalizar tu compra.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "fas fa-search-location",
      title: "Seguimiento",
      description: "Recibirás un número de seguimiento por correo electrónico una vez que tu pedido sea despachado.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "fas fa-ban",
      title: "Restricciones",
      description: "No realizamos envíos a apartados postales ni fuera de El Salvador.",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-shipping-fast text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Política de Envíos
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            En <span className="font-semibold text-indigo-600">Tienda Ecommerce</span> nos comprometemos a entregar tus productos de manera rápida y segura. Consulta los detalles de nuestra política de envíos:
          </motion.p>

          {/* Shipping Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {shippingInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${item.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-l-4 border-yellow-500 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-lightbulb text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-yellow-700">Recomendaciones</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Verifica que la dirección de entrega esté completa y correcta para evitar retrasos. Si tienes dudas sobre tu envío, contáctanos a{' '}
              <a 
                href="mailto:soporte@tiendaecommerce.com" 
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
              >
                soporte@tiendaecommerce.com
              </a>.
            </p>
          </motion.div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500 text-center"
          >
            <i className="fas fa-info-circle text-blue-600 text-3xl mb-3"></i>
            <p className="text-gray-700 leading-relaxed">
              Nos esforzamos por cumplir los plazos de entrega, pero pueden presentarse demoras por causas ajenas a nuestra empresa (clima, tráfico, etc.).
            </p>
          </motion.div>
        </div>
      </motion.main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}