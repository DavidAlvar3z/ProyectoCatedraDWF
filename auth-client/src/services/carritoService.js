// src/services/carritoService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import { secureGetItem } from '../utils/secureStorage';

/**
 * Obtiene o crea el carrito del usuario
 * @param {number} idUser - ID del usuario
 * @returns {Promise<Object>} - Objeto carrito
 */
export const getOrCreateCarrito = async (idUser) => {
  const userId = idUser || parseInt(secureGetItem('userId'), 10);
  
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.CARRITO}/${userId}`);
};

/**
 * Obtiene los items de un carrito
 * @param {number} idCarrito - ID del carrito
 * @returns {Promise<Array>} - Lista de items con fallbacks
 */
export const getCarritoItems = async (idCarrito) => {
  if (!idCarrito) {
    throw new Error('ID de carrito no proporcionado');
  }
  
  const items = await httpClient.get(`${API_ENDPOINTS.CARRITO}/${idCarrito}/items`);

  // Asegurar estructura consistente con fallbacks
  return items.map((item) => ({
    ...item,
    producto: {
      ...item.producto,
      nombre: item.producto?.nombre || 'Producto desconocido',
      imagen: item.producto?.imagen || '/placeholder.jpg',
      precio: item.producto?.precio || 0,
    },
  }));
};