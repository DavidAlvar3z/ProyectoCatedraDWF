// src/services/ropaService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene todas las prendas
 * @returns {Promise<Array>}
 */
export const getAllRopa = async () => {
  return httpClient.get(API_ENDPOINTS.ROPA);
};

/**
 * Obtiene una prenda por ID
 * @param {number} id - ID de la prenda
 * @returns {Promise<Object>}
 */
export const getRopaById = async (id) => {
  if (!id) {
    throw new Error('ID de prenda no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.ROPA}/${id}`);
};

/**
 * Crea una nueva prenda (Admin)
 * @param {Object} ropa - Datos de la prenda
 * @returns {Promise<Object>}
 */
export const createRopa = async (ropa) => {
  return httpClient.post(API_ENDPOINTS.ROPA, ropa);
};

/**
 * Actualiza una prenda (Admin)
 * @param {number} id - ID de la prenda
 * @param {Object} ropa - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateRopa = async (id, ropa) => {
  if (!id) {
    throw new Error('ID de prenda no proporcionado');
  }
  
  return httpClient.put(`${API_ENDPOINTS.ROPA}/${id}`, ropa);
};

/**
 * Elimina una prenda (Admin)
 * @param {number} id - ID de la prenda
 * @returns {Promise<{success: boolean}>}
 */
export const deleteRopa = async (id) => {
  if (!id) {
    throw new Error('ID de prenda no proporcionado');
  }
  
  await httpClient.delete(`${API_ENDPOINTS.ROPA}/${id}`);
  return { success: true };
};