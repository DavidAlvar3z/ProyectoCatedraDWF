// src/services/direccionService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene las direcciones de un usuario
 * @param {number} idUser - ID del usuario
 * @returns {Promise<Array>}
 */
export const getByUserDirecciones = async (idUser) => {
  if (!idUser) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.DIRECCION}/user/${idUser}`);
};

/**
 * Guarda una nueva dirección
 * @param {Object} direccion - Datos de la dirección
 * @param {number} idUser - ID del usuario
 * @returns {Promise<Object>}
 */
export const saveDireccion = async (direccion, idUser) => {
  if (!idUser) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.post(`${API_ENDPOINTS.DIRECCION}?idUser=${idUser}`, direccion);
};

/**
 * Actualiza una dirección existente
 * @param {Object} direccion - Datos actualizados (debe incluir idDireccion)
 * @returns {Promise<Object>}
 */
export const updateDireccion = async (direccion) => {
  if (!direccion.idDireccion) {
    throw new Error('ID de dirección no proporcionado');
  }
  
  return httpClient.put(API_ENDPOINTS.DIRECCION, direccion);
};