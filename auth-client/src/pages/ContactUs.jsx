import React from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const contactInfo = [
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: "soporte@tiendaecommerce.com",
      href: "mailto:soporte@tiendaecommerce.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "fas fa-phone",
      label: "Teléfono",
      value: "+503 1234-5678",
      href: "tel:+50312345678",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Dirección",
      value: "Calle Principal #123, San Salvador, El Salvador",
      href: null,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "fas fa-clock",
      label: "Horario de atención",
      value: "Lunes a Viernes, 8:00 a.m. - 6:00 p.m.",
      href: null,
      color: "from-orange-500 to-red-500",
    },
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
        className="relative w-full max-w-3xl mx-auto"
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
              <i className="fas fa-comments text-3xl text-white"></i>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Contáctanos
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Nuestro equipo está
            listo para ayudarte. Puedes comunicarte con nosotros a través de los
            siguientes medios:
          </motion.p>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="block bg-white rounded-xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                      >
                        <i className={`${item.icon} text-white text-xl`}></i>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-500 text-sm mb-1">
                          {item.label}
                        </h3>
                        <p className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                          {item.value}
                        </p>
                      </div>

                      <i className="fas fa-external-link-alt text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                      >
                        <i className={`${item.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-500 text-sm mb-1">
                          {item.label}
                        </h3>
                        <p className="text-gray-800 font-medium">{item.value}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-l-4 border-indigo-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-paper-plane text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-700">
                Formulario de Contacto
              </h2>
            </div>

            <form className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-indigo-500"></i>
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-white/50"
                  placeholder="Tu nombre"
                  disabled
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2 text-indigo-500"></i>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-white/50"
                  placeholder="tu@email.com"
                  disabled
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-comment-alt mr-2 text-indigo-500"></i>
                  Mensaje
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-white/50 resize-none"
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  disabled
                />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <i className="fas fa-info-circle text-yellow-600 text-xl"></i>
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Formulario próximamente.</span>{" "}
                    Por ahora, contáctanos directamente por email o teléfono.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-4 px-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
                disabled
              >
                <i className="fas fa-lock"></i>
                <span>Enviar (próximamente)</span>
              </button>
            </form>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 text-center text-gray-600 leading-relaxed"
          >
            También puedes encontrarnos en nuestras redes sociales para recibir
            atención personalizada y enterarte de nuestras novedades.
          </motion.p>

          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center gap-4 mt-6"
          >
            {[
              { icon: "fab fa-facebook", color: "from-blue-500 to-blue-600" },
              { icon: "fab fa-instagram", color: "from-pink-500 to-purple-600" },
              { icon: "fab fa-twitter", color: "from-blue-400 to-cyan-500" },
              { icon: "fab fa-whatsapp", color: "from-green-500 to-teal-600" },
            ].map((social, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <i className={`${social.icon} text-white text-xl`}></i>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.main>

      {/* Blob animation styles */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
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
