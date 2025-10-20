import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPedidos, updatePedidoEstado } from "../services/pedidoService";

export default function PedidoCrud() {
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadoUpdate, setEstadoUpdate] = useState({});
  const [size, setSize] = useState(10);

  const fetchPedidos = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllPedidos(pageNum, size);
      let list = [];
      let total = 1;
      let pageNumber = 0;
      if (Array.isArray(result)) {
        list = result.slice(pageNum * size, pageNum * size + size);
        total = Math.ceil(result.length / size);
        pageNumber = pageNum;
      } else if (result.items) {
        list = result.items;
        total = result.totalPages || 1;
        pageNumber = result.page ?? pageNum;
        setSize(result.size || 10);
      }
      setPedidos(list);
      setPage(pageNumber);
      setTotalPages(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(page);
    // eslint-disable-next-line
  }, [page]);

  const handleEstadoChange = (idPedido, newEstado) => {
    setEstadoUpdate((prev) => ({ ...prev, [idPedido]: newEstado }));
  };

  const handleUpdateEstado = async (idPedido) => {
    const newEstado = estadoUpdate[idPedido];
    if (!newEstado) return;
    try {
      await updatePedidoEstado(idPedido, newEstado);
      fetchPedidos(page);
    } catch (err) {
      alert("Error al actualizar el estado: " + err.message);
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  function renderDireccion(pedido) {
    const alias = pedido.aliasDireccion;
    const calle = pedido.calleDireccion;
    const ciudad = pedido.ciudadDireccion;
    const depto = pedido.departamentoDireccion;
    if (alias || calle || ciudad || depto) {
      return [alias, calle, ciudad, depto].filter(Boolean).join(", ");
    }
    return pedido.idDireccion ? `ID: ${pedido.idDireccion}` : "-";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-clipboard-list text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        {pedidos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
            <p className="text-gray-600">No hay pedidos registrados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-hashtag mr-2 text-blue-500"></i>
                      ID
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                      Dirección
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-calendar mr-2 text-blue-500"></i>
                      Fecha
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-dollar-sign mr-2 text-blue-500"></i>
                      Total
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                      Estado
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-cog mr-2 text-blue-500"></i>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {pedidos.map((pedido, index) => (
                      <motion.tr
                        key={pedido.idPedido}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-indigo-600">#{pedido.idPedido}</td>
                        <td className="py-4 px-6 text-gray-700">{renderDireccion(pedido)}</td>
                        <td className="py-4 px-6 text-gray-700">
                          {pedido.fechaInicio
                            ? new Date(pedido.fechaInicio).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xl font-bold text-green-600">
                            ${pedido.total}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              pedido.estado === "ENTREGADO"
                                ? "bg-green-100 text-green-800"
                                : pedido.estado === "CANCELADO"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pedido.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <select
                              className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={estadoUpdate[pedido.idPedido] || ""}
                              onChange={(e) =>
                                handleEstadoChange(pedido.idPedido, e.target.value)
                              }
                            >
                              <option value="">Cambiar estado</option>
                              <option value="PENDIENTE">Pendiente</option>
                              <option value="PAGADO">Pagado</option>
                              <option value="EN_PROCESO">En Proceso</option>
                              <option value="ENTREGADO">Entregado</option>
                              <option value="CANCELADO">Cancelado</option>
                            </select>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleUpdateEstado(pedido.idPedido)}
                              disabled={!estadoUpdate[pedido.idPedido]}
                            >
                              <i className="fas fa-sync-alt mr-2"></i>
                              Actualizar
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={page === 0}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
                  page === 0
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <i className="fas fa-chevron-left"></i>
                Anterior
              </motion.button>
              <span className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold shadow-lg">
                {page + 1} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={page >= totalPages - 1}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
                  page >= totalPages - 1
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                Siguiente
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}