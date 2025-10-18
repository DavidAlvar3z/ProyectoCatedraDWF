// src/services/historialPedidoService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene historial de pedidos - Paginado
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>}
 */
export const getHistorialPedidos = async (page = 0, size = 10) => {
  if (typeof page !== 'number' || typeof size !== 'number') {
    throw new Error('Los parámetros page y size deben ser números');
  }

  return httpClient.get(`${API_ENDPOINTS.HISTORIAL_PEDIDO}?page=${page}&size=${size}`);
};

/**
 * Obtiene un registro de historial por ID
 * @param {number} id - ID del registro
 * @returns {Promise<Object>}
 */
export const getHistorialPedidoById = async (id) => {
  if (typeof id !== 'number') {
    throw new Error('El parámetro id debe ser un número');
  }

  return httpClient.get(`${API_ENDPOINTS.HISTORIAL_PEDIDO}/${id}`);
};