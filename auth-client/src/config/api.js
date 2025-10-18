// src/config/api.js

/**
 * Configuración centralizada de URLs del API
 * Usar variables de entorno para diferentes ambientes
 */

// URL base del API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// URLs específicas por módulo
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  PRODUCTO: `${API_BASE_URL}/auth/producto`,
  PEDIDO: `${API_BASE_URL}/auth/pedido`,
  CARRITO: `${API_BASE_URL}/auth/carrito`,
  CARRITO_ITEM: `${API_BASE_URL}/auth/carrito-item`,
  DIRECCION: `${API_BASE_URL}/auth/direcciones`,
  PARAMETRO: `${API_BASE_URL}/auth/parametros`,
  NOTIFICACION: `${API_BASE_URL}/auth/notificacion`,
  RESENA: `${API_BASE_URL}/auth/resenas`,
  HISTORIAL_PEDIDO: `${API_BASE_URL}/auth/historial-pedidos`,
  HISTORIAL_PUNTOS: `${API_BASE_URL}/auth/historial-puntos`,
  USERS: `${API_BASE_URL}/auth/users`,
  TIPO_PRODUCTO: `${API_BASE_URL}/auth/tipoproducto`,
  ROPA: `${API_BASE_URL}/auth/ropa`,
};

// Configuración de timeouts y reintentos
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Headers comunes
export const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
});