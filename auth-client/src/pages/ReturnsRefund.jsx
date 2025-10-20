import React from 'react';
import { motion } from 'framer-motion';

export default function ReturnsRefund() {
  const steps = [
    {
      number: 1,
      title: "Solicita la devolución",
      description: "Escríbenos a soporte@tiendaecommerce.com indicando tu número de pedido y motivo de la devolución.",
      icon: "fas fa-envelope-open-text",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      title: "Prepara el producto",
      description: "El producto debe estar sin uso, en su empaque original y con todos los accesorios.",
      icon: "fas fa-box-open",
      color: "from-green-500 to-teal-500"
    },
    {
      number: 3,
      title: "Envío de devolución",
      description: "Te indicaremos la dirección a la que debes enviar el producto. Los costos de envío por devolución corren por cuenta del cliente, salvo productos defectuosos.",
      icon: "fas fa-shipping-fast",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: 4,
      title: "Procesamiento del reembolso",
      description: "Una vez recibido y revisado el producto, procesaremos el reembolso en un plazo de 5–7 días hábiles.",
      icon: "fas fa-money-check-alt",
      color: "from-orange-500 to-red-500"
    }
  ];

  const policies = [
    {
      icon: "fas fa-calendar-check",
      title: "Plazo para devoluciones",
      description: "30 días desde la fecha de compra.",
      color: "text-blue-600"
    },
    {
      icon: "fas fa-ban",
      title: "Excepciones",
      description: "No se aceptan devoluciones de productos en oferta, personalizados o usados.",
      color: "text-red-600"
    },
    {
      icon: "fas fa-percentage",
      title: "Reembolsos parciales",
      description: "Si el producto presenta daños por mal uso, el reembolso puede ser parcial o rechazado.",
      color: "text-orange-600"
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
              <i className="fas fa-undo-alt text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Devoluciones y Reembolsos
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            Queremos que estés satisfecho con tu compra. Si necesitas devolver un producto, sigue estos pasos:
          </motion.p>

          {/* Steps */}
          <div className="space-y-6 mb-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 8 }}
                className="group bg-white rounded-2xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${step.icon} text-white text-2xl`}></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed ml-11">
                      {step.description}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-l-4 border-indigo-500 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-clipboard-list text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-700">Políticas Importantes</h2>
            </div>

            <div className="space-y-4">
              {policies.map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white rounded-xl p-4 border border-indigo-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <i className={`${policy.icon} ${policy.color} text-2xl flex-shrink-0 mt-1`}></i>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{policy.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{policy.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center border-l-4 border-green-500"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-question-circle text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">¿Necesitas ayuda?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Si tienes dudas sobre el proceso, contáctanos y con gusto te ayudaremos.
            </p>
            <motion.a
              href="mailto:soporte@tiendaecommerce.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <i className="fas fa-envelope"></i>
              <span>Contactar Soporte</span>
            </motion.a>
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