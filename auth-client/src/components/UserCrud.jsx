import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers, updateUserRole, deleteUser } from "../services/userService";

export default function UserCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleUpdate, setRoleUpdate] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  // 📦 Obtener usuarios
  const fetchUsers = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllUsers(pageNum, size);
      let list = [];
      let total = 1;
      let pageNumber = 0;
      let pageSize = size;

      if (Array.isArray(result.content)) {
        list = result.content;
        total = result.totalPages ?? 1;
        pageNumber = result.number ?? 0;
        pageSize = result.size ?? size;
      } else if (result.items) {
        list = result.items;
        total = result.totalPages || 1;
        pageNumber = result.page ?? pageNum;
        pageSize = result.size || size;
      } else if (Array.isArray(result)) {
        list = result.slice(pageNum * size, pageNum * size + size);
        total = Math.ceil(result.length / size);
        pageNumber = pageNum;
        pageSize = size;
      }

      setUsers(list);
      setPage(pageNumber);
      setTotalPages(total);
      setSize(pageSize);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line
  }, [page, size]);

  // 🎭 Manejadores
  const handleRoleChange = (userId, newRole) => {
    setRoleUpdate((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = async (userId) => {
    const newRole = roleUpdate[userId];
    if (!newRole) return;
    try {
      await updateUserRole(userId, newRole);
      setRoleUpdate((prev) => ({ ...prev, [userId]: "" }));
      fetchUsers(page);
    } catch (err) {
      alert("Error al actualizar el rol: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(userId);
      fetchUsers(page);
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const filteredUsers = search
    ? users.filter((user) =>
        (user.username || "").toLowerCase().includes(search.toLowerCase())
      )
    : users;

  // 🌀 Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
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

  // 🧱 Render principal
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-users-cog text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
      </div>

      <div className="mb-6 flex justify-end">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fas fa-users-slash text-gray-400 text-5xl mb-4"></i>
            <p className="text-gray-600">No hay usuarios registrados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-hashtag mr-2 text-purple-500"></i>ID
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-user mr-2 text-purple-500"></i>Nombre
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-envelope mr-2 text-purple-500"></i>Email
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-calendar mr-2 text-purple-500"></i>Fecha Nacimiento
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-phone mr-2 text-purple-500"></i>Teléfono
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-shield-alt mr-2 text-purple-500"></i>Rol
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-gray-700">
                      <i className="fas fa-cog mr-2 text-purple-500"></i>Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-purple-600">#{user.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                              {(user.username || user.nombre || "U").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">
                              {user.username || user.nombre || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{user.email}</td>
                        <td className="py-4 px-6 text-gray-700">{user.fechaNacimiento || "-"}</td>
                        <td className="py-4 px-6 text-gray-700">{user.telefono || "-"}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            {user.roleName || user.roles?.[0] || "-"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <select
                              className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              value={roleUpdate[user.id] || ""}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                              <option value="">Cambiar rol</option>
                              <option value="ROLE_USER">Usuario</option>
                              <option value="ROLE_EMPLOYEE">Empleado</option>
                              <option value="ROLE_ADMIN">Administrador</option>
                            </select>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              onClick={() => handleUpdateRole(user.id)}
                              disabled={!roleUpdate[user.id]}
                            >
                              <i className="fas fa-sync-alt"></i>
                              Actualizar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-9 h-9 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                              onClick={() => handleDelete(user.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={page === 0}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 ${
                  page === 0
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
                }`}
              >
                <i className="fas fa-chevron-left"></i>
                Anterior
              </motion.button>

              <span className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg">
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
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
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
