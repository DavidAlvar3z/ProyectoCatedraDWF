// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { secureGetItem, secureSetItem, secureRemoveItem } from '../utils/secureStorage';

/**
 * Contexto para manejo de usuario y carrito
 */
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // Estado de userId
  const [userId, setUserIdState] = useState(() => {
    const storedUserId = secureGetItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  });

  // Estado de carritoId
  const [carritoId, setCarritoIdState] = useState(() => {
    const storedCarritoId = secureGetItem('carritoId');
    return storedCarritoId ? parseInt(storedCarritoId, 10) : null;
  });

  // Sincronizar userId con secureStorage
  useEffect(() => {
    if (userId) {
      secureSetItem('userId', userId.toString());
    } else {
      secureRemoveItem('userId');
    }
  }, [userId]);

  // Sincronizar carritoId con secureStorage
  useEffect(() => {
    if (carritoId) {
      secureSetItem('carritoId', carritoId.toString());
    } else {
      secureRemoveItem('carritoId');
    }
  }, [carritoId]);

  // Wrapper para setUserId que acepta tanto number como string
  const setUserId = (id) => {
    if (id === null || id === undefined) {
      setUserIdState(null);
    } else {
      setUserIdState(parseInt(id, 10));
    }
  };

  // Wrapper para setCarritoId
  const setCarritoId = (id) => {
    if (id === null || id === undefined) {
      setCarritoIdState(null);
    } else {
      setCarritoIdState(parseInt(id, 10));
    }
  };

  const value = {
    userId,
    setUserId,
    carritoId,
    setCarritoId,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;