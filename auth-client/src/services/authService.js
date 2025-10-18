// src/services/authService.js
import { jwtDecode } from 'jwt-decode';
import { httpClient } from '../utils/httpClient';
import { secureSetItem } from '../utils/secureStorage';
import { API_ENDPOINTS } from '../config/api';

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<string>} - Token JWT
 */
export async function register(userData) {
  const {
    username,
    email,
    password,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    fechaNacimiento,
    telefono,
    dui,
    direccion,
  } = userData;

  try {
    // No usar httpClient aquí porque no tenemos token aún
    const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        telefono,
        dui,
        direccion,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    const token = await response.text();
    
    // Decodificar y guardar userId
    const decoded = jwtDecode(token);
    if (decoded?.userId) {
      secureSetItem('userId', decoded.userId.toString());
    }

    return token;
  } catch (error) {
    console.error('Error en registro:', error.message);
    throw error;
  }
}

/**
 * Inicia sesión de usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<string>} - Token JWT
 */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMsg = 'Error al iniciar sesión';
      
      try {
        const error = await response.json();
        if (error?.message) {
          errorMsg = error.message;
        } else if (response.status === 401) {
          errorMsg = 'Usuario o contraseña incorrectos';
        }
      } catch {
        if (response.status === 401) {
          errorMsg = 'Usuario o contraseña incorrectos';
        }
      }
      
      throw new Error(errorMsg);
    }

    const token = await response.text();
    const decoded = jwtDecode(token);

    if (!decoded || !decoded.userId) {
      throw new Error('El token no contiene un userId válido');
    }

    // Guardar userId en secureStorage (NO localStorage)
    secureSetItem('userId', decoded.userId.toString());

    return token;
  } catch (error) {
    console.error('Error en login:', error.message);
    throw error;
  }
}