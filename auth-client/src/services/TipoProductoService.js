// src/services/TipoProductoService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene todos los tipos de producto
 * @returns {Promise<Array>}
 */
export const getAllTiposProductos = async () => {
  return httpClient.get(API_ENDPOINTS.TIPO_PRODUCTO);
};

/**
 * Obtiene un tipo de producto por ID
 * @param {number} id - ID del tipo
 * @returns {Promise<Object>}
 */
export const getTipoProductoById = async (id) => {
  if (!id) {
    throw new Error('ID de tipo de producto no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.TIPO_PRODUCTO}/${id}`);
};

/**
 * Crea un nuevo tipo de producto (Admin)
 * @param {Object} tipoProducto - Datos del tipo
 * @returns {Promise<Object>}
 */
export const createTipoProducto = async (tipoProducto) => {
  return httpClient.post(API_ENDPOINTS.TIPO_PRODUCTO, tipoProducto);
};

/**
 * Actualiza un tipo de producto (Admin)
 * @param {number} id - ID del tipo
 * @param {Object} tipoProducto - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateTipoProducto = async (id, tipoProducto) => {
  if (!id) {
    throw new Error('ID de tipo de producto no proporcionado');
  }
  
  return httpClient.put(`${API_ENDPOINTS.TIPO_PRODUCTO}/${id}`, tipoProducto);
};

/**
 * Elimina un tipo de producto (Admin)
 * @param {number} id - ID del tipo
 * @returns {Promise<{success: boolean}>}
 */
export const deleteTipoProducto = async (id) => {
  if (!id) {
    throw new Error('ID de tipo de producto no proporcionado');
  }
  
  await httpClient.delete(`${API_ENDPOINTS.TIPO_PRODUCTO}/${id}`);
  return { success: true };
};