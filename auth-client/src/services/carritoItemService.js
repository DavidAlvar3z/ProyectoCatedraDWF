// src/services/carritoItemService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Agrega un item al carrito
 * @param {Object} item - { idCarrito, idProducto, cantidad }
 * @returns {Promise<Object>}
 */
export const addCarritoItem = async (item) => {
  const { idCarrito, idProducto, cantidad } = item;
  
  if (!idCarrito || !idProducto || !cantidad) {
    throw new Error('Faltan campos requeridos: idCarrito, idProducto, cantidad');
  }

  return httpClient.post(API_ENDPOINTS.CARRITO_ITEM, {
    idCarrito,
    idProducto,
    cantidad,
  });
};

/**
 * Elimina un item del carrito
 * @param {number} idCarritoItem - ID del item
 * @returns {Promise<{success: boolean}>}
 */
export const removeCarritoItem = async (idCarritoItem) => {
  if (!idCarritoItem) {
    throw new Error('ID de CarritoItem no proporcionado');
  }

  await httpClient.delete(`${API_ENDPOINTS.CARRITO_ITEM}/${idCarritoItem}`);
  return { success: true };
};

/**
 * Actualiza la cantidad de un item
 * @param {Object} data - { idCarritoItem, idCarrito, idProducto, cantidad }
 * @returns {Promise<Object>}
 */
export const updateCarritoItem = async ({ idCarritoItem, idCarrito, idProducto, cantidad }) => {
  if (!idCarritoItem || !idCarrito || !idProducto || cantidad == null) {
    throw new Error('Faltan datos para actualizar el item');
  }

  return httpClient.put(`${API_ENDPOINTS.CARRITO_ITEM}/${idCarritoItem}`, {
    idCarrito,
    idProducto,
    cantidad,
  });
};