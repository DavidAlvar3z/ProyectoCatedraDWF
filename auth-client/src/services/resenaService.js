// src/services/resenaService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import { secureGetItem } from '../utils/secureStorage';

/**
 * Mapea número de rating a enum del backend
 * @param {number} rating - Rating numérico (1-5)
 * @returns {string} - Enum (ONE, TWO, THREE, FOUR, FIVE)
 */
const mapRatingToEnum = (rating) => {
  const ratingMap = {
    1: 'ONE',
    2: 'TWO',
    3: 'THREE',
    4: 'FOUR',
    5: 'FIVE',
  };
  return ratingMap[rating] || 'FIVE';
};

/**
 * Crea una reseña para un producto
 * @param {Object} data - { idProducto, comentario, rating }
 * @returns {Promise<Object>}
 */
export const crearResena = async ({ idProducto, comentario, rating }) => {
  const idUser = secureGetItem('userId');

  if (!idUser) {
    throw new Error('Usuario no autenticado');
  }

  if (!idProducto || !comentario || !rating) {
    throw new Error('Faltan campos requeridos: idProducto, comentario, rating');
  }

  const ratingEnum = mapRatingToEnum(parseInt(rating, 10));

  return httpClient.post(API_ENDPOINTS.RESENA, {
    idProducto,
    comentario,
    rating: ratingEnum,
    idUser: parseInt(idUser, 10),
  });
};

/**
 * Obtiene reseñas de un producto (sin paginar)
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Array>}
 */
export const obtenerResenasPorProducto = async (idProducto) => {
  if (!idProducto) {
    throw new Error('ID de producto no proporcionado');
  }

  return httpClient.get(`${API_ENDPOINTS.RESENA}/producto/${idProducto}`);
};

/**
 * Obtiene todas las reseñas - Paginado
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>}
 */
export const getAllResenasPaginated = async (page = 0, size = 10) => {
  return httpClient.get(`${API_ENDPOINTS.RESENA}?page=${page}&size=${size}`);
};

/**
 * Obtiene reseñas de un producto - Paginado
 * @param {number} idProducto - ID del producto
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<Object>}
 */
export const obtenerResenasPorProductoPaginadas = async (idProducto, page = 0, size = 5) => {
  if (!idProducto) {
    throw new Error('ID de producto no proporcionado');
  }

  return httpClient.get(
    `${API_ENDPOINTS.RESENA}/producto/${idProducto}/paginated?page=${page}&size=${size}`
  );
};