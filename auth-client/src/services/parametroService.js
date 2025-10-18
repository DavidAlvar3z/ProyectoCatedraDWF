// src/services/parametroService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene todos los parámetros del sistema
 * @returns {Promise<Array>}
 */
export const getAllParametros = async () => {
  return httpClient.get(`${API_ENDPOINTS.PARAMETRO}/all`);
};

/**
 * Crea un nuevo parámetro (Admin)
 * @param {Object} payload - { clave, valor, descripcion }
 * @returns {Promise<Object>}
 */
export const crearParametro = async (payload) => {
  return httpClient.post(API_ENDPOINTS.PARAMETRO, payload);
};

/**
 * Edita un parámetro existente (Admin)
 * @param {number} id - ID del parámetro
 * @param {Object} payload - Datos actualizados
 * @returns {Promise<Object>}
 */
export const editarParametro = async (id, payload) => {
  if (!id) {
    throw new Error('ID de parámetro no proporcionado');
  }
  
  return httpClient.put(`${API_ENDPOINTS.PARAMETRO}/${id}`, payload);
};

/**
 * Obtiene un parámetro por su clave
 * @param {string} clave - Clave del parámetro (ej: "costo_envio", "descuento_cupon")
 * @returns {Promise<Object|null>}
 */
export const getParametroByClave = async (clave) => {
  if (!clave) {
    throw new Error('Clave de parámetro no proporcionada');
  }

  try {
    return await httpClient.get(`${API_ENDPOINTS.PARAMETRO}/clave/${clave}`);
  } catch (error) {
    // Si no existe, retornar null en lugar de error
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};