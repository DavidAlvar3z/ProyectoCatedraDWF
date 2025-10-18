// src/services/historialPuntosService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene historial de puntos - Paginado
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>}
 */
export const getHistorialPuntos = async (page = 0, size = 10) => {
  if (typeof page !== 'number' || typeof size !== 'number') {
    throw new Error('Los parámetros page y size deben ser números');
  }

  return httpClient.get(`${API_ENDPOINTS.HISTORIAL_PUNTOS}?page=${page}&size=${size}`);
};

/**
 * Obtiene un registro de historial de puntos por ID
 * @param {number} id - ID del registro
 * @returns {Promise<Object>}
 */
export const getHistorialPuntosById = async (id) => {
  if (typeof id !== 'number') {
    throw new Error('El parámetro id debe ser un número');
  }

  return httpClient.get(`${API_ENDPOINTS.HISTORIAL_PUNTOS}/${id}`);
};

/**
 * Obtiene historial de puntos de un usuario - Paginado
 * @param {number} userId - ID del usuario
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>}
 */
export const getHistorialPuntosByUser = async (userId, page = 0, size = 10) => {
  if (typeof userId !== 'number') {
    throw new Error('El parámetro userId debe ser un número');
  }

  return httpClient.get(
    `${API_ENDPOINTS.HISTORIAL_PUNTOS}/usuario/${userId}?page=${page}&size=${size}`
  );
};

export default getHistorialPuntos;