// src/services/productoService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene productos paginados (para admin/CRUD)
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @returns {Promise<{items: Array, page: number, size: number, totalPages: number, totalElements: number}>}
 */
export const getAllProductosPaged = async (page = 0, size = 10) => {
  const data = await httpClient.get(
    `${API_ENDPOINTS.PRODUCTO}/all?page=${page}&size=${size}`
  );

  // Extraer lista de productos de respuesta HATEOAS
  const items = data._embedded?.productoResponseList || [];
  const pageInfo = data.page || {};

  return {
    items,
    page: pageInfo.number ?? 0,
    size: pageInfo.size ?? size,
    totalPages: pageInfo.totalPages ?? 1,
    totalElements: pageInfo.totalElements ?? items.length,
  };
};

/**
 * Obtiene todos los productos sin paginar (para landing/user)
 * @returns {Promise<Array>}
 */
export const getAllProductos = async () => {
  const data = await httpClient.get(`${API_ENDPOINTS.PRODUCTO}/all`);
  return data._embedded?.productoResponseList || [];
};

/**
 * Obtiene productos recomendados para un usuario
 * @param {number} idUser - ID del usuario
 * @returns {Promise<Array>}
 */
export const getRecommendedProductos = async (idUser) => {
  if (!idUser) return [];

  try {
    const data = await httpClient.get(
      `${API_ENDPOINTS.PRODUCTO}/recomendados/${idUser}`
    );

    return data._embedded?.productoResponseList || [];
  } catch (error) {
    // Si no hay recomendaciones (204 o 404), retornar array vacío
    if (error.message.includes('404') || error.message.includes('204')) {
      return [];
    }
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object>}
 */
export const getProductoById = async (id) => {
  if (!id) throw new Error('ID de producto no proporcionado');
  return httpClient.get(`${API_ENDPOINTS.PRODUCTO}/${id}`);
};

/**
 * Obtiene todos los tipos de producto
 * @returns {Promise<Array>}
 */
export const getAllTiposProductos = async () => {
  return httpClient.get(API_ENDPOINTS.TIPO_PRODUCTO);
};

/**
 * Crea un nuevo producto (ADMIN)
 * @param {Object} producto - Datos del producto
 * @returns {Promise<Object>}
 */
export const createProducto = async (producto) => {
  const payload = {
    ...producto,
    idTipoProducto: parseInt(producto.idTipoProducto, 10),
  };

  if (!payload.idTipoProducto) {
    throw new Error('El campo "ID Tipo Producto" es obligatorio y debe ser un número válido.');
  }

  return httpClient.post(API_ENDPOINTS.PRODUCTO, payload);
};

/**
 * Actualiza un producto existente (ADMIN)
 * @param {number} id - ID del producto
 * @param {Object} producto - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateProducto = async (id, producto) => {
  if (!id) throw new Error('ID no proporcionado para actualización');

  const payload = {
    ...producto,
    idTipoProducto: parseInt(producto.idTipoProducto, 10),
  };

  if (!payload.idTipoProducto) {
    throw new Error('El campo "ID Tipo Producto" es obligatorio y debe ser un número válido.');
  }

  return httpClient.put(`${API_ENDPOINTS.PRODUCTO}/${id}`, payload);
};

/**
 * Elimina un producto (ADMIN)
 * @param {number} id - ID del producto
 * @returns {Promise<{success: boolean}>}
 */
export const deleteProducto = async (id) => {
  if (!id) throw new Error('ID no proporcionado para eliminación');
  
  await httpClient.delete(`${API_ENDPOINTS.PRODUCTO}/${id}`);
  return { success: true };
};