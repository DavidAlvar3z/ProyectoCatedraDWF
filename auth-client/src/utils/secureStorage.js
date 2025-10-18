// src/utils/secureStorage.js
import SecureLS from 'secure-ls';

// Obtener clave de encriptación desde variables de entorno
const ENCRYPTION_SECRET = process.env.REACT_APP_ENCRYPTION_SECRET || 'defaultKeyOnlyForDevelopment';

// Advertir si se está usando la clave por defecto en producción
if (process.env.REACT_APP_ENV === 'production' && ENCRYPTION_SECRET === 'defaultKeyOnlyForDevelopment') {
  console.error('⚠️ ADVERTENCIA: Usando clave de encriptación por defecto en producción!');
}

const secureLs = new SecureLS({
  encodingType: 'aes',
  isCompression: true,
  encryptionSecret: ENCRYPTION_SECRET,
});

/**
 * Guarda un valor en secure localStorage
 * @param {string} key - Clave del valor
 * @param {any} value - Valor a guardar
 */
export const secureSetItem = (key, value) => {
  try {
    secureLs.set(key, value);
  } catch (error) {
    console.error(`Error al guardar ${key} en secure storage:`, error);
  }
};

/**
 * Obtiene un valor desde secure localStorage
 * @param {string} key - Clave del valor
 * @returns {any} - Valor almacenado o null
 */
export const secureGetItem = (key) => {
  try {
    return secureLs.get(key);
  } catch (error) {
    console.error(`Error al obtener ${key} desde secure storage:`, error);
    return null;
  }
};

/**
 * Elimina un valor de secure localStorage
 * @param {string} key - Clave del valor
 */
export const secureRemoveItem = (key) => {
  try {
    secureLs.remove(key);
  } catch (error) {
    console.error(`Error al eliminar ${key} de secure storage:`, error);
  }
};

/**
 * Limpia todo el secure localStorage
 */
export const secureClear = () => {
  try {
    secureLs.removeAll();
  } catch (error) {
    console.error('Error al limpiar secure storage:', error);
  }
};

export default secureLs;