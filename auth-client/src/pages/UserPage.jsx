import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Products from '../components/Products';

export default function UserPage() {
  const { token } = useContext(AuthContext);
  const { searchQuery = '' } = useOutletContext() || {};

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-lock text-red-600 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Usuario no autenticado</h2>
          <p className="text-gray-600 mb-6">Por favor, inicia sesión para acceder a esta página.</p>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Iniciar Sesión</span>
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Banner */}
          <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  ¡Bienvenido de vuelta! 👋
                </h2>
                <p className="text-blue-100 text-lg">
                  Descubre nuestros productos más recientes y ofertas especiales
                </p>
              </motion.div>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              { icon: "fas fa-box", label: "Productos", value: "1000+", color: "from-blue-500 to-cyan-500" },
              { icon: "fas fa-tags", label: "Ofertas", value: "50+", color: "from-green-500 to-teal-500" },
              { icon: "fas fa-star", label: "Valoración", value: "4.8/5", color: "from-yellow-500 to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <i className={`${stat.icon} text-white text-2xl`}></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shopping-bag text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Nuestros Productos</h3>
              </div>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <i className="fas fa-filter text-indigo-600"></i>
                  <span className="text-sm font-medium text-indigo-700">
                    Buscando: "{searchQuery}"
                  </span>
                </motion.div>
              )}
            </div>
            
            <Products searchQuery={searchQuery} />
          </motion.div>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-indigo-500/50 transition-all duration-300 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-arrow-up text-xl"></i>
      </motion.button>

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