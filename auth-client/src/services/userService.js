// src/services/userService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene el perfil de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>}
 */
export const getUserProfile = async (userId) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.USERS}/${userId}`);
};

/**
 * Actualiza el perfil del usuario
 * @param {Object} data - { userId, currentPassword, newUsername, newEmail }
 * @returns {Promise<Object>}
 */
export const updateProfile = async ({ userId, currentPassword, newUsername, newEmail }) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }

  return httpClient.put(`${API_ENDPOINTS.USERS}/${userId}/profile`, {
    currentPassword,
    newUsername,
    newEmail,
  });
};

/**
 * Cambia la contraseña del usuario
 * @param {Object} data - { userId, currentPassword, newPassword }
 * @returns {Promise<boolean>}
 */
export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }

  await httpClient.put(
    `${API_ENDPOINTS.USERS}/${userId}/password?currentPassword=${currentPassword}&newPassword=${newPassword}`
  );
  
  return true;
};

/**
 * Obtiene todos los usuarios (Admin) - Paginado
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @param {string} sort - Ordenamiento (ej: "idUser,asc")
 * @returns {Promise<Object>}
 */
export const getAllUsersPaginated = async (page = 0, size = 10, sort = 'idUser,asc') => {
  return httpClient.get(
    `${API_ENDPOINTS.USERS}/paginated?page=${page}&size=${size}&sort=${sort}`
  );
};

/**
 * Crea un nuevo usuario (Admin)
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  return httpClient.post(API_ENDPOINTS.USERS, userData);
};

/**
 * Actualiza un usuario (Admin)
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateUserByAdmin = async (userId, userData) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.put(`${API_ENDPOINTS.USERS}/${userId}/admin`, userData);
};

/**
 * Elimina un usuario (Admin)
 * @param {number} userId - ID del usuario
 * @returns {Promise<boolean>}
 */
export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  await httpClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
  return true;
};

/**
 * Lista todos los usuarios sin paginar (Legacy)
 * @returns {Promise<Array>}
 */
export const listUsers = async () => {
  return httpClient.get(API_ENDPOINTS.USERS);
};

/**
 * Actualiza solo el rol de un usuario (Admin)
 * @param {number} userId - ID del usuario
 * @param {string} newRole - Nuevo rol (ROLE_USER, ROLE_ADMIN, ROLE_EMPLOYEE)
 * @returns {Promise<Object>}
 */
export const updateUserRole = async (userId, newRole) => {
  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }
  
  return httpClient.put(`${API_ENDPOINTS.USERS}/${userId}/admin`, {
    roleName: newRole,
  });
};

// Alias para compatibilidad
export const getAllUsers = getAllUsersPaginated;