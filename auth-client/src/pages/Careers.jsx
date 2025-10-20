import React from 'react';
import { motion } from 'framer-motion';

export default function Careers() {
  const vacancies = [
    { title: "Desarrollador Frontend", icon: "fas fa-code", color: "from-blue-500 to-cyan-500" },
    { title: "Especialista en Logística", icon: "fas fa-truck", color: "from-green-500 to-teal-500" },
    { title: "Ejecutivo de Atención al Cliente", icon: "fas fa-headset", color: "from-purple-500 to-pink-500" },
    { title: "Analista de Marketing Digital", icon: "fas fa-chart-line", color: "from-orange-500 to-red-500" }
  ];

  const benefits = [
    { icon: "fas fa-users", text: "Ambiente de trabajo colaborativo y dinámico", color: "text-blue-500" },
    { icon: "fas fa-chart-line", text: "Oportunidades de crecimiento profesional", color: "text-green-500" },
    { icon: "fas fa-graduation-cap", text: "Capacitación continua", color: "text-purple-500" },
    { icon: "fas fa-gift", text: "Beneficios competitivos", color: "text-red-500" },
    { icon: "fas fa-lightbulb", text: "Proyectos innovadores", color: "text-yellow-500" }
  ];

  const steps = [
    { step: "1", text: "Envía tu CV y carta de presentación a empleos@tiendaecommerce.com", icon: "fas fa-envelope" },
    { step: "2", text: "Revisión de perfiles y preselección", icon: "fas fa-search" },
    { step: "3", text: "Entrevista inicial (virtual o presencial)", icon: "fas fa-video" },
    { step: "4", text: "Prueba técnica o de habilidades (según el puesto)", icon: "fas fa-tasks" },
    { step: "5", text: "Entrevista final y oferta", icon: "fas fa-handshake" }
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
              <i className="fas fa-briefcase text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Empleos
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-gray-700 text-lg leading-relaxed text-center"
          >
            ¿Te gustaría formar parte de un equipo innovador y apasionado por el ecommerce? En <span className="font-semibold text-indigo-600">Tienda Ecommerce</span> buscamos personas talentosas y comprometidas para crecer juntos.
          </motion.p>

          {/* Vacancies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-clipboard-list text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-700">Vacantes Actuales</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {vacancies.map((vacancy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white rounded-xl p-5 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${vacancy.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <i className={`${vacancy.icon} text-white text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                        {vacancy.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Posición disponible</p>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-10 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-l-4 border-indigo-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-star text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-700">¿Por qué trabajar con nosotros?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-transparent hover:border-indigo-200"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${benefit.icon} ${benefit.color} text-2xl`}></i>
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Process */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-route text-white text-xl"></i>
              </div>
              <h2 className="text-2xl font-semibold text-purple-700">Proceso de Selección</h2>
            </div>

            <div className="space-y-4">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="group bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-transparent hover:border-purple-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                    <i className={`${item.icon} text-purple-400 text-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></i>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-l-4 border-green-500 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-rocket text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">¿Interesado?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Si quieres unirte a nuestro equipo, envíanos tu información y cuéntanos por qué eres el candidato ideal. ¡Esperamos conocerte pronto!
            </p>
            <motion.a
              href="mailto:empleos@tiendaecommerce.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <i className="fas fa-envelope"></i>
              <span>Enviar CV</span>
            </motion.a>
          </motion.section>
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