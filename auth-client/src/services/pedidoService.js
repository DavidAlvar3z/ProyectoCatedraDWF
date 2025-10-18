// src/services/pedidoService.js
import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Obtiene todos los pedidos (Admin) - Paginado
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<{items: Array, page: number, totalPages: number}>}
 */
export const getAllPedidos = async (page = 0, size = 10) => {
  const data = await httpClient.get(
    `${API_ENDPOINTS.PEDIDO}/all?page=${page}&size=${size}`
  );

  const items = data._embedded?.pedidoResponseList || [];
  const pageInfo = data.page || {};

  return {
    items,
    page: pageInfo.number || 0,
    size: pageInfo.size || size,
    totalPages: pageInfo.totalPages || 1,
    totalElements: pageInfo.totalElements || items.length,
  };
};

/**
 * Obtiene pedidos de un usuario - Paginado
 * @param {number} idUser - ID del usuario
 * @param {number} page - Número de página
 * @param {number} size - Tamaño de página
 * @returns {Promise<{items: Array, page: number, totalPages: number}>}
 */
export const getPedidosByUser = async (idUser, page = 0, size = 10) => {
  if (!idUser) {
    throw new Error('ID de usuario no proporcionado');
  }

  const data = await httpClient.get(
    `${API_ENDPOINTS.PEDIDO}/user/${idUser}?page=${page}&size=${size}`
  );

  const items = data._embedded?.pedidoResponseList || [];
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
 * Obtiene un pedido por ID
 * @param {number} idPedido - ID del pedido
 * @returns {Promise<Object>}
 */
export const getPedidoById = async (idPedido) => {
  if (!idPedido) {
    throw new Error('ID de pedido no proporcionado');
  }
  
  return httpClient.get(`${API_ENDPOINTS.PEDIDO}/${idPedido}`);
};

/**
 * Realiza el checkout (crear pedido)
 * @param {Object} payload - { idCarrito, tipoPago, cuponCodigo?, idDireccion }
 * @returns {Promise<Object>}
 */
export const checkoutPedido = async (payload) => {
  return httpClient.post(`${API_ENDPOINTS.PEDIDO}/checkout`, payload);
};

/**
 * Actualiza el estado de un pedido (Admin)
 * @param {number} idPedido - ID del pedido
 * @param {string} newEstado - Nuevo estado (PENDIENTE, PAGADO, EN_PROCESO, ENTREGADO, CANCELADO)
 * @returns {Promise<Object>}
 */
export const updatePedidoEstado = async (idPedido, newEstado) => {
  const endpointMap = {
    PENDIENTE: 'confirmar',
    PAGADO: 'pagar',
    EN_PROCESO: 'envio',
    ENTREGADO: 'entregar',
    CANCELADO: 'cancelar?motivo=admin',
  };

  const action = endpointMap[newEstado];
  
  if (!action) {
    throw new Error(`Estado inválido: ${newEstado}`);
  }

  return httpClient.post(`${API_ENDPOINTS.PEDIDO}/${idPedido}/${action}`, {});
};

/**
 * Obtiene ganancias totales (Dashboard)
 * @returns {Promise<number>}
 */
export const getGananciasTotales = async () => {
  return httpClient.get(`${API_ENDPOINTS.PEDIDO}/dashboard/ganancias/totales`);
};

/**
 * Obtiene ganancias por periodo (Dashboard)
 * @param {string} fechaInicio - Fecha inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha fin (YYYY-MM-DD)
 * @returns {Promise<number>}
 */
export const getGananciasPorPeriodo = async (fechaInicio, fechaFin) => {
  return httpClient.get(
    `${API_ENDPOINTS.PEDIDO}/dashboard/ganancias/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );
};

/**
 * Obtiene productos más vendidos (Dashboard)
 * @param {number} limit - Cantidad de productos
 * @returns {Promise<Object>}
 */
export const getProductosMasVendidos = async (limit = 5) => {
  return httpClient.get(
    `${API_ENDPOINTS.PEDIDO}/dashboard/productos-mas-vendidos?limit=${limit}`
  );
};