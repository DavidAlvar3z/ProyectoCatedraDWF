import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { getAllProductos, getRecommendedProductos } from '../services/productoService';
import UserContext from '../context/UserContext';

export default function Landing() {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollOffset(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const all = await getAllProductos();
        const destacados = all.sort((a, b) => b.precio - a.precio).slice(0, 5);
        setProductosDestacados(destacados);
        if (userId) {
          const rec = await getRecommendedProductos(userId);
          setRecomendados(rec);
        }
      } catch (e) {
        console.error("Error obteniendo productos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [userId]);

  const renderCard = p => (
    <motion.div
      key={p.idProducto}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/producto/${p.idProducto}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={p.imagen || "https://via.placeholder.com/300"}
          alt={p.nombre}
          className="w-full h-full object-cover"
        />
        {p.precioOriginal && p.precioOriginal > p.precio && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg"
          >
            {Math.round(((p.precioOriginal - p.precio) / p.precioOriginal) * 100)}% OFF
          </motion.span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {p.nombre}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {p.descripcion}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-indigo-600">
              {new Intl.NumberFormat("es-SV", {
                style: "currency",
                currency: "USD",
              }).format(p.precio)}
            </span>
            {p.precioOriginal && p.precioOriginal > p.precio && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {new Intl.NumberFormat("es-SV", {
                  style: "currency",
                  currency: "USD",
                }).format(p.precioOriginal)}
              </span>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <i className="fas fa-arrow-right"></i>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando productos...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 min-h-[70vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Productos Premium
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                  Entregados a tu Puerta
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Descubre nuestra selección exclusiva de productos de alta calidad con envío rápido y seguro
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/user')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fas fa-shopping-bag"></i>
                  Comprar Ahora
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fas fa-info-circle"></i>
                  Conocer Más
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <i className="fas fa-chevron-down text-white text-2xl opacity-50"></i>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Novedades de Temporada
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestros productos más exclusivos y populares
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosDestacados.map(renderCard)}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      {userId && recomendados.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Recomendado para ti
              </h2>
              <p className="text-xl text-gray-600">
                Productos seleccionados especialmente para tus gustos
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recomendados.map(renderCard)}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-shipping-fast",
                title: "Envío Rápido",
                description: "Entrega en 3-5 días hábiles",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "fas fa-shield-alt",
                title: "Compra Segura",
                description: "Protección en cada transacción",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: "fas fa-headset",
                title: "Soporte 24/7",
                description: "Estamos aquí para ayudarte",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}