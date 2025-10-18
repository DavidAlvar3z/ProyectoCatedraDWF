// src/utils/httpClient.js
import { secureGetItem, secureRemoveItem } from './secureStorage';
import { API_CONFIG } from '../config/api';

/**
 * Cliente HTTP centralizado con manejo de errores y reintentos
 */
class HttpClient {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Obtiene el token de autenticación
   */
  getAuthToken() {
    return secureGetItem('token');
  }

  /**
   * Obtiene headers comunes incluyendo autenticación
   */
  getHeaders(customHeaders = {}) {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...customHeaders,
    };
  }

  /**
   * Maneja la respuesta del servidor
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Si es 401, el token expiró
      if (response.status === 401) {
        this.handleUnauthorized();
      }

      // Extraer mensaje de error
      const errorMessage = this.extractErrorMessage(data, response.status);
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * Extrae el mensaje de error de diferentes formatos de respuesta
   */
  extractErrorMessage(data, status) {
    if (typeof data === 'string') {
      return data;
    }

    if (data.message) {
      return data.message;
    }

    if (data.description) {
      return data.description;
    }

    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(e => e.description || e.message).join(', ');
    }

    // Mensajes por defecto según código de estado
    const defaultMessages = {
      400: 'Solicitud inválida',
      401: 'No autorizado',
      403: 'Acceso denegado',
      404: 'Recurso no encontrado',
      500: 'Error interno del servidor',
      503: 'Servicio no disponible',
    };

    return defaultMessages[status] || `Error ${status}`;
  }

  /**
   * Maneja el error 401 (token expirado)
   */
  handleUnauthorized() {
    // Limpiar tokens
    secureRemoveItem('token');
    secureRemoveItem('userId');
    secureRemoveItem('carritoId');

    // Redirigir al login (solo si no estamos ya ahí)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Realiza una petición con reintentos
   */
  async requestWithRetry(url, options, attempt = 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);

    } catch (error) {
      // Si es el último intento, lanzar el error
      if (attempt >= API_CONFIG.RETRY_ATTEMPTS) {
        if (error.name === 'AbortError') {
          throw new Error('Tiempo de espera agotado. Por favor, verifica tu conexión.');
        }
        throw error;
      }

      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));

      // Reintentar
      return this.requestWithRetry(url, options, attempt + 1);
    }
  }

  /**
   * GET request
   */
  async get(url, customHeaders = {}) {
    return this.requestWithRetry(url, {
      method: 'GET',
      headers: this.getHeaders(customHeaders),
    });
  }

  /**
   * POST request
   */
  async post(url, data, customHeaders = {}) {
    return this.requestWithRetry(url, {
      method: 'POST',
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(url, data, customHeaders = {}) {
    return this.requestWithRetry(url, {
      method: 'PUT',
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(url, customHeaders = {}) {
    return this.requestWithRetry(url, {
      method: 'DELETE',
      headers: this.getHeaders(customHeaders),
    });
  }
}

// Exportar instancia única
export const httpClient = new HttpClient();

// Exportar clase para testing
export default HttpClient;