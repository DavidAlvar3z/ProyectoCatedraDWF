import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  const sections = [
    {
      title: "Uso de la Plataforma",
      icon: "fas fa-user-shield",
      color: "from-blue-500 to-cyan-500",
      items: [
        "Debes ser mayor de edad para realizar compras.",
        "La información proporcionada debe ser verídica y actualizada.",
        "No está permitido el uso indebido de la plataforma ni actividades fraudulentas."
      ]
    },
    {
      title: "Propiedad Intelectual",
      icon: "fas fa-copyright",
      color: "from-green-500 to-teal-500",
      content: "Todos los contenidos, marcas y diseños son propiedad de Tienda Ecommerce o sus proveedores y están protegidos por la ley."
    },
    {
      title: "Compras y Pagos",
      icon: "fas fa-shopping-cart",
      color: "from-purple-500 to-pink-500",
      items: [
        "Los precios pueden cambiar sin previo aviso.",
        "Las compras están sujetas a disponibilidad de stock.",
        "El pago debe realizarse a través de los métodos autorizados."
      ]
    },
    {
      title: "Limitación de Responsabilidad",
      icon: "fas fa-shield-alt",
      color: "from-orange-500 to-red-500",
      content: "Tienda Ecommerce no se responsabiliza por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma."
    },
    {
      title: "Modificaciones",
      icon: "fas fa-edit",
      color: "from-indigo-500 to-purple-500",
      content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Te recomendamos revisarlos periódicamente."
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
              <i className="fas fa-file-contract text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Términos y Condiciones
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            Lee nuestros términos y condiciones para conocer tus derechos y obligaciones al usar nuestra plataforma. Al acceder y utilizar <span className="font-semibold text-indigo-600">Tienda Ecommerce</span>, aceptas cumplir con las siguientes disposiciones:
          </motion.p>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${section.icon} text-white text-xl`}></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-indigo-700">
                    {index + 1}. {section.title}
                  </h2>
                </div>

                {section.items ? (
                  <ul className="space-y-3 ml-2">
                    {section.items.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="fas fa-check text-indigo-600 text-xs"></i>
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed ml-2">{section.content}</p>
                )}
              </motion.section>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-l-4 border-yellow-500 text-center"
          >
            <i className="fas fa-exclamation-triangle text-yellow-600 text-3xl mb-3"></i>
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Actualización de Términos</h3>
            <p className="text-gray-700 leading-relaxed">
              Estos términos pueden ser modificados en cualquier momento. Es tu responsabilidad revisarlos periódicamente para estar al tanto de los cambios.
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