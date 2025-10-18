// src/services/notificationService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene todas las notificaciones de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>}
 */
export const getUserNotifications = async (userId) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }

  return httpClient.get(`${API_ENDPOINTS.NOTIFICACION}/usuario/${userId}`);
};

/**
 * Marca una notificación como leída
 * @param {number} notificationId - ID de la notificación
 * @returns {Promise<void>}
 */
export const markNotificationRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error('ID de notificación no proporcionado');
  }

  await httpClient.put(`${API_ENDPOINTS.NOTIFICACION}/leer/${notificationId}`);
};