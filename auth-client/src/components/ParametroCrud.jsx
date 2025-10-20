import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllParametros,
  editarParametro,
} from "../services/parametroService";

export default function ParametroCrud() {
  const [parametros, setParametros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [msg, setMsg] = useState(null);

  const fetchParametros = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await getAllParametros();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res.items)
        ? res.items
        : Array.isArray(res._embedded?.parametroResponseList)
        ? res._embedded.parametroResponseList
        : [];
      setParametros(list);
    } catch (err) {
      setMsg("Error al cargar parámetros: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParametros();
  }, []);

  const handleEdit = (param) => {
    setEditId(param.idParametro);
    setEditValue(param.valor);
    setMsg(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditValue("");
    setMsg(null);
  };

  const handleSave = async (param) => {
    setMsg(null);
    try {
      await editarParametro(param.idParametro, {
        ...param,
        valor: editValue,
      });
      setMsg("Parámetro actualizado correctamente.");
      setEditId(null);
      setEditValue("");
      fetchParametros();
    } catch (err) {
      setMsg("Error al actualizar: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parámetros...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-sliders-h text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Parámetros del Sistema</h2>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl text-center font-semibold ${
                msg.startsWith("Error") 
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500" 
                  : "bg-green-50 text-green-700 border-l-4 border-green-500"
              }`}
            >
              <i className={`fas ${msg.startsWith("Error") ? "fa-exclamation-circle" : "fa-check-circle"} mr-2`}></i>
              {msg}
            </motion.div>
          )}
        </AnimatePresence>

        {parametros.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
            <p className="text-gray-600">No hay parámetros registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <th className="py-4 px-6 text-left font-bold text-gray-700">
                    <i className="fas fa-key mr-2 text-indigo-500"></i>
                    Clave
                  </th>
                  <th className="py-4 px-6 text-left font-bold text-gray-700">
                    <i className="fas fa-tag mr-2 text-indigo-500"></i>
                    Valor
                  </th>
                  <th className="py-4 px-6 text-left font-bold text-gray-700">
                    <i className="fas fa-info-circle mr-2 text-indigo-500"></i>
                    Descripción
                  </th>
                  <th className="py-4 px-6 text-left font-bold text-gray-700">
                    <i className="fas fa-cog mr-2 text-indigo-500"></i>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {parametros.map((param, index) => (
                    <motion.tr
                      key={param.idParametro}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-800">{param.clave}</td>
                      <td className="py-4 px-6">
                        {editId === param.idParametro ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="border-2 border-indigo-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-semibold">
                            {param.valor}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{param.descripcion}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {editId === param.idParametro ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                                onClick={() => handleSave(param)}
                              >
                                <i className="fas fa-check"></i>
                                Guardar
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition flex items-center gap-2"
                                onClick={handleCancel}
                              >
                                <i className="fas fa-times"></i>
                                Cancelar
                              </motion.button>
                            </>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2"
                              onClick={() => handleEdit(param)}
                            >
                              <i className="fas fa-edit"></i>
                              Editar
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}