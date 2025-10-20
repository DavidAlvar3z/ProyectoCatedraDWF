import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  const sections = [
    {
      title: "Información que Recopilamos",
      icon: "fas fa-database",
      color: "from-blue-500 to-cyan-500",
      items: [
        "Datos de contacto: nombre, correo electrónico, dirección y teléfono.",
        "Información de pago: solo para procesar compras, no almacenamos datos de tarjetas.",
        "Datos de navegación: cookies y registros de actividad en la web."
      ]
    },
    {
      title: "Uso de la Información",
      icon: "fas fa-cogs",
      color: "from-green-500 to-teal-500",
      items: [
        "Procesar y entregar tus pedidos.",
        "Mejorar la experiencia de usuario y personalizar el contenido.",
        "Enviar notificaciones y promociones (puedes darte de baja en cualquier momento)."
      ]
    },
    {
      title: "Protección de Datos",
      icon: "fas fa-shield-alt",
      color: "from-purple-500 to-pink-500",
      content: "Utilizamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados."
    },
    {
      title: "Tus Derechos",
      icon: "fas fa-user-shield",
      color: "from-orange-500 to-red-500",
      items: [
        "Acceder, corregir o eliminar tus datos personales.",
        "Solicitar información sobre el uso de tus datos.",
        "Retirar tu consentimiento en cualquier momento."
      ],
      footer: "Para ejercer tus derechos, contáctanos en privacidad@tiendaecommerce.com"
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
              <i className="fas fa-user-lock text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Política de Privacidad
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            En <span className="font-semibold text-indigo-600">Tienda Ecommerce</span> protegemos tu información personal y explicamos cómo la recopilamos y usamos. Al utilizar nuestra plataforma, aceptas las prácticas descritas a continuación.
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
                  <h2 className="text-2xl font-semibold text-indigo-700">{section.title}</h2>
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

                {section.footer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                  >
                    <p className="text-gray-700">
                      {section.footer.split('privacidad@tiendaecommerce.com')[0]}
                      <a 
                        href="mailto:privacidad@tiendaecommerce.com" 
                        className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
                      >
                        privacidad@tiendaecommerce.com
                      </a>
                      {section.footer.split('privacidad@tiendaecommerce.com')[1]}
                    </p>
                  </motion.div>
                )}
              </motion.section>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500 text-center"
          >
            <i className="fas fa-info-circle text-blue-600 text-3xl mb-3"></i>
            <p className="text-gray-700 leading-relaxed">
              Esta política puede ser actualizada periódicamente. Te recomendamos revisarla regularmente para estar informado sobre cómo protegemos tu información.
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