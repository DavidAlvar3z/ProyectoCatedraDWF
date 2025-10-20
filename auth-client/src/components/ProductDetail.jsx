import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';

import { getAllProductos } from '../services/productoService';
import { addCarritoItem } from '../services/carritoItemService';
import { crearResena, obtenerResenasPorProductoPaginadas } from '../services/resenaService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import MySwal from '../utils/swal';

const labels = {
  0.5: 'Terrible',
  1: 'Malo',
  1.5: 'Regular',
  2: 'Aceptable',
  2.5: 'Bueno',
  3: 'Muy Bueno',
  3.5: 'Genial',
  4: 'Excelente',
  4.5: 'Impresionante',
  5: 'Perfecto',
};

function getLabelText(value) {
  return `${value} Estrella${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function ProductDetail() {
  const { idProducto } = useParams();
  const [producto, setProducto] = useState(null);
  const [displayedResenas, setDisplayedResenas] = useState([]);
  const [form, setForm] = useState({ comentario: '', rating: 0 });
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsPerPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [hoverRating, setHoverRating] = useState(-1);

  const { carrito } = useContext(CartContext);
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productos = await getAllProductos();
        const prod = Array.isArray(productos)
          ? productos.find((p) => p.idProducto === parseInt(idProducto, 10))
          : productos._embedded?.productoResponseList?.find((p) => p.idProducto === parseInt(idProducto, 10));
        if (!prod) throw new Error('Producto no encontrado');
        setProducto(prod);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        MySwal.fire('Error', 'No se pudo cargar el producto.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idProducto]);

  const fetchProductResenas = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const resenasData = await obtenerResenasPorProductoPaginadas(
        parseInt(idProducto, 10),
        currentPage,
        reviewsPerPage
      );
      setDisplayedResenas(resenasData._embedded?.resenaResponseList || []);
      setPageCount(resenasData.page?.totalPages || 0);
    } catch (error) {
      console.error('Error al cargar reseñas del producto:', error);
      MySwal.fire('Error', 'No se pudieron cargar las reseñas del producto.', 'error');
      setDisplayedResenas([]);
      setPageCount(0);
    } finally {
      setReviewsLoading(false);
    }
  }, [idProducto, currentPage, reviewsPerPage]);

  useEffect(() => {
    if (idProducto) {
      fetchProductResenas();
    }
  }, [idProducto, currentPage, fetchProductResenas]);

  const handleAddToCart = async () => {
    try {
      if (!carrito?.idCarrito) {
        await MySwal.fire('Error', 'Carrito no disponible.', 'error');
        return;
      }
      await addCarritoItem({
        idCarrito: carrito.idCarrito,
        idProducto: producto.idProducto,
        cantidad,
      });
      await MySwal.fire('Agregado', `"${producto.nombre}" añadido al carrito.`, 'success');
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      await MySwal.fire('Error', 'No se pudo añadir al carrito.', 'error');
    }
  };

  const handleResenaSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userData) throw new Error('Usuario no autenticado');
      if (!producto?.idProducto) throw new Error('Producto no disponible para reseña');
      if (form.rating === 0) {
        MySwal.fire('Advertencia', 'Por favor, selecciona una calificación.', 'warning');
        return;
      }

      await crearResena({
        idProducto: producto.idProducto,
        comentario: form.comentario,
        rating: form.rating,
      });
      await MySwal.fire('Reseña enviada', 'Tu reseña ha sido publicada.', 'success');
      setForm({ comentario: '', rating: 0 });
      setHoverRating(-1);
      setCurrentPage(0);
      await fetchProductResenas();
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      await MySwal.fire('Error', 'No se pudo enviar la reseña.', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event, newValue) => {
    setForm({ ...form, rating: newValue });
  };

  const handleIncrease = () => {
    setCantidad(prev => Math.min(prev + 1, 99));
  };

  const handleDecrease = () => {
    setCantidad(prev => Math.max(prev - 1, 1));
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const getRatingNumber = useCallback((ratingEnum) => {
    const ratingsMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5,
    };
    return ratingsMap[ratingEnum] || parseFloat(ratingEnum) || 0;
  }, []);

  if (loading && !producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando producto...</p>
        </motion.div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Volver
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2 font-semibold"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i> Volver
        </motion.button>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 mb-12 border border-white/20"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center"
            >
              <div className="relative group">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="rounded-2xl object-cover max-h-[500px] w-full shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {producto.nombre}
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {producto.descripcion}
                </p>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-5xl font-bold text-indigo-600">
                    ${producto.precio.toFixed(2)}
                  </span>
                  {producto.precioOriginal && producto.precioOriginal > producto.precio && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ${producto.precioOriginal.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                        {Math.round(((producto.precioOriginal - producto.precio) / producto.precioOriginal) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-box text-indigo-500 w-6"></i>
                    <span className="text-gray-700">
                      <strong>Stock:</strong> {producto.cantidad} unidades
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-tag text-indigo-500 w-6"></i>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                      {producto.nombreTipo}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-star text-yellow-500 w-6"></i>
                    <span className="text-gray-700">
                      <strong>{producto.cantidadPuntos}</strong> puntos al comprar
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-semibold">Cantidad:</span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-10 h-10 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                      onClick={handleDecrease}
                      disabled={cantidad <= 1}
                    >
                      <i className="fas fa-minus text-indigo-600"></i>
                    </motion.button>
                    <span className="font-bold text-xl w-12 text-center">{cantidad}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-10 h-10 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                      onClick={handleIncrease}
                      disabled={cantidad >= 99}
                    >
                      <i className="fas fa-plus text-indigo-600"></i>
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={!carrito}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Añadir al carrito
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-star text-white text-xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Reseñas</h2>
          </div>

          {/* Review Form */}
          <form onSubmit={handleResenaSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8 border-l-4 border-indigo-500">
            <textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              placeholder="Escribe tu reseña..."
              required
              rows="4"
              className="w-full border-2 border-indigo-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-semibold">Calificación:</span>
                <Rating
                  name="product-review-rating"
                  value={form.rating}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={handleRatingChange}
                  onChangeActive={(event, newHover) => {
                    setHoverRating(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  readOnly={!userData}
                />
                {userData && form.rating !== null && (
                  <span className="text-sm text-gray-600">
                    {labels[hoverRating !== -1 ? hoverRating : form.rating]}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={!userData || form.rating === 0 || form.comentario.trim() === ''}
              >
                <i className="fas fa-paper-plane"></i>
                Publicar reseña
              </motion.button>
            </div>
            {!userData && (
              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Inicia sesión para dejar una reseña
              </p>
            )}
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando reseñas...</p>
              </div>
            ) : displayedResenas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <i className="fas fa-comment-slash text-gray-400 text-5xl mb-4"></i>
                <p className="text-gray-600 text-lg">Sé el primero en dejar una reseña</p>
              </div>
            ) : (
              <AnimatePresence>
                {displayedResenas.map((resena, index) => (
                  <motion.div
                    key={resena.idResena}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {resena.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="font-bold text-gray-800">{resena.username || 'Anónimo'}</span>
                      </div>
                      <Rating
                        value={getRatingNumber(resena.rating)}
                        readOnly
                        precision={0.5}
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{resena.comentario}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-8 flex justify-center">
              <ReactPaginate
                previousLabel={<><i className="fas fa-chevron-left mr-2"></i>Anterior</>}
                nextLabel={<>Siguiente<i className="fas fa-chevron-right ml-2"></i></>}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'flex gap-2'}
                pageClassName={'px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors'}
                activeClassName={'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-600'}
                previousClassName={'px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors font-semibold'}
                nextClassName={'px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors font-semibold'}
                breakClassName={'px-4 py-2'}
                forcePage={currentPage}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}