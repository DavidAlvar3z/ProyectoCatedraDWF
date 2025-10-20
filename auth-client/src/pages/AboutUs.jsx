import React from 'react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const values = [
    { icon: "fas fa-heart", title: "Compromiso", description: "Nos esforzamos por superar las expectativas de nuestros clientes." },
    { icon: "fas fa-lightbulb", title: "Innovación", description: "Buscamos constantemente nuevas formas de mejorar la experiencia de compra." },
    { icon: "fas fa-shield-alt", title: "Transparencia", description: "Operamos con honestidad y claridad en cada proceso." },
    { icon: "fas fa-star", title: "Calidad", description: "Seleccionamos cuidadosamente cada producto para asegurar su excelencia." },
    { icon: "fas fa-users", title: "Trabajo en equipo", description: "Creemos en el poder de la colaboración para alcanzar grandes metas." }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header with icon */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-building text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Nuestra Historia
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="mb-8 text-gray-700 text-lg leading-relaxed"
          >
            Bienvenido a <span className="font-semibold text-indigo-600">Tienda Ecommerce</span>, fundada en 2022 con la misión de ofrecer productos de calidad y la mejor experiencia de compra en línea. Desde nuestros inicios, hemos crecido gracias a la confianza de miles de clientes satisfechos en El Salvador.
          </motion.p>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
            {/* Misión */}
            <motion.section 
              variants={fadeInUp}
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-bullseye text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-indigo-700">Misión</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Brindar a nuestros clientes una plataforma segura, fácil de usar y con una amplia variedad de productos, garantizando siempre la mejor atención y satisfacción.
              </p>
            </motion.section>

            {/* Visión */}
            <motion.section 
              variants={fadeInUp}
              className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-eye text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-purple-700">Visión</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ser la tienda en línea líder en El Salvador y Centroamérica, reconocida por la innovación, calidad y excelencia en el servicio.
              </p>
            </motion.section>

            {/* Valores */}
            <motion.section variants={fadeInUp} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-l-4 border-indigo-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-gem text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-indigo-700">Nuestros Valores</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${value.icon} text-white`}></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-indigo-700 mb-1">{value.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Equipo */}
            <motion.section 
              variants={fadeInUp}
              className="group bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-green-700">Nuestro Equipo</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Contamos con un equipo multidisciplinario de profesionales apasionados por el ecommerce, la tecnología y la atención al cliente. Juntos, trabajamos para ofrecerte la mejor experiencia posible.
              </p>
            </motion.section>
          </motion.div>
        </div>
      </motion.main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}