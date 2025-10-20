import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ← AGREGADO AnimatePresence
import { login as loginService } from '../services/authService';
import { getOrCreateCarrito } from '../services/carritoService';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { secureSetItem, secureRemoveItem } from '../utils/secureStorage';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData, login } = useContext(AuthContext);
  const { setCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePostLogin = async () => {
      if (!userData) return;

      try {
        const cart = await getOrCreateCarrito(userData.userId);
        setCarrito(cart);
        secureSetItem('carritoId', cart.idCarrito.toString());

        const roles = Array.isArray(userData.roles)
          ? userData.roles
          : typeof userData.roles === "string"
          ? [userData.roles]
          : [];
        if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_EMPLOYEE')) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      } catch (error) {
        setError('Error al cargar el carrito');
      }
    };

    handlePostLogin();
  }, [userData, navigate, setCarrito]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = await loginService(form.username, form.password);
      login(token);
    } catch (err) {
      setError(err.message || 'Usuario o contraseña incorrectos');
      secureRemoveItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border border-white/20"
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"></div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 p-8 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg"
            >
              <i className="fas fa-user-circle text-4xl"></i>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Bienvenido de vuelta</h1>
            <p className="text-blue-100">Inicia sesión para acceder a tu cuenta</p>
          </motion.div>
          
          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-user mr-2 text-indigo-500"></i>
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                  placeholder="Ingresa tu usuario"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-lock mr-2 text-indigo-500"></i>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <i className="fas fa-lock"></i>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Iniciar sesión</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1"
              >
                Regístrate aquí
                <i className="fas fa-arrow-right text-sm"></i>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

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