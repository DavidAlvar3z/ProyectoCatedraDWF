import React, { useEffect, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCarritoItems } from '../services/carritoService';
import { removeCarritoItem, updateCarritoItem } from '../services/carritoItemService';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const { carrito, loading, envio } = useContext(CartContext);
  const [envioValor, setEnvioValor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEnvioValor(envio ?? 5);
  }, [envio]);

  const agruparItems = useCallback((itemsOriginales) => {
    const itemsMap = new Map();
    itemsOriginales.forEach((item) => {
      const key = item.producto?.idProducto;
      if (itemsMap.has(key)) {
        const existente = itemsMap.get(key);
        existente.cantidad += item.cantidad;
      } else {
        itemsMap.set(key, { ...item });
      }
    });
    return Array.from(itemsMap.values());
  }, []);

  const calculateTotals = useCallback((itemsList) => {
    const newSubtotal = itemsList.reduce(
      (sum, i) => sum + (i.cantidad * (i.producto?.precio || 0)),
      0
    );
    const envioFinal = envioValor !== null ? envioValor : envio ?? 5;
    const newTotal = newSubtotal + envioFinal;
    setSubtotal(newSubtotal);
    setTotal(newTotal);
  }, [envioValor, envio]);

  const load = useCallback(async () => {
    if (loading || !carrito?.idCarrito) return;
    try {
      const cartItems = await getCarritoItems(carrito.idCarrito);
      const groupedItems = agruparItems(cartItems);
      setItems(groupedItems);
      calculateTotals(groupedItems);
    } catch (error) {
      console.error('Error al cargar ítems:', error.message);
    }
  }, [carrito, loading, agruparItems, calculateTotals]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (idProducto) => {
    const itemToRemove = items.find((i) => i.producto?.idProducto === idProducto);
    if (!itemToRemove) return;
    try {
      const updatedItems = items.filter((i) => i.producto.idProducto !== idProducto);
      setItems(updatedItems);
      calculateTotals(updatedItems);
      await removeCarritoItem(itemToRemove.idCarritoItem);
    } catch (error) {
      console.error('Error al eliminar ítem:', error.message);
      load();
    }
  };

  const handleQty = async (item, delta) => {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;
    try {
      const updatedItems = items.map((i) =>
        i.producto.idProducto === item.producto.idProducto
          ? { ...i, cantidad: nuevaCantidad }
          : i
      );
      setItems(updatedItems);
      calculateTotals(updatedItems);
      await updateCarritoItem({
        idCarritoItem: item.idCarritoItem,
        idCarrito: carrito.idCarrito,
        idProducto: item.producto.idProducto,
        cantidad: nuevaCantidad,
      });
    } catch (error) {
      console.error('Error al actualizar cantidad:', error.message);
      load();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando carrito...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-shopping-cart text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mi Carrito
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20"
        >
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-cart text-gray-400 text-5xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">Agrega productos para comenzar tu compra</p>
              <button
                onClick={() => navigate('/user')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Ir a comprar
              </button>
            </motion.div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.li
                      key={item.producto.idProducto}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col md:flex-row items-center gap-6 py-6 hover:bg-indigo-50/50 rounded-xl px-4 transition-colors duration-300"
                    >
                      <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={item.producto.imagen || '/placeholder-product.jpg'}
                          alt={item.producto.nombre}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      
                      <div className="flex-1 w-full">
                        <h4 className="font-bold text-xl text-gray-800 mb-1">{item.producto.nombre}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.producto.descripcion}</p>
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          ${item.producto.precio.toFixed(2)} c/u
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQty(item, -1);
                            }}
                            disabled={item.cantidad <= 1}
                          >
                            <i className="fas fa-minus text-indigo-600"></i>
                          </motion.button>
                          <span className="font-bold text-lg w-8 text-center">{item.cantidad}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-white rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQty(item, 1);
                            }}
                          >
                            <i className="fas fa-plus text-indigo-600"></i>
                          </motion.button>
                        </div>
                        <span className="text-indigo-700 font-bold text-lg">
                          ${(item.cantidad * item.producto.precio).toFixed(2)}
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all flex items-center justify-center shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.producto.idProducto);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </motion.button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="w-full md:w-auto space-y-3">
                    <div className="flex justify-between md:justify-start md:gap-12">
                      <span className="text-gray-700 font-semibold">Subtotal:</span>
                      <span className="text-gray-900 font-bold">${subtotal ? subtotal.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:gap-12">
                      <span className="text-gray-700 font-semibold">Envío:</span>
                      <span className="text-gray-900 font-bold">${envio ? envio.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:gap-12 pt-3 border-t border-gray-200">
                      <span className="text-xl font-bold text-indigo-700">Total:</span>
                      <span className="text-2xl font-bold text-indigo-700">${total ? total.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => navigate('/user/checkout', { state: { total } })}
                  >
                    <i className="fas fa-credit-card"></i>
                    <span>Proceder al Pago</span>
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}


