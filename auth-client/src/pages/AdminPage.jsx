// src/pages/AdminPage.jsx
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PedidoCrud from "../components/PedidoCrud";
import ProductoCrud from "../components/ProductoCrud";
import AdminDashboard from "../components/AdminDashboard";
import ParametroCrud from "../components/ParametroCrud";
import UserCrud from "../components/UserCrud";
import { AuthContext } from "../context/AuthContext";

export default function AdminPage() {
  const [menu, setMenu] = useState("dashboard");
  const { userData } = useContext(AuthContext);

  const roles = Array.isArray(userData?.roles)
    ? userData.roles
    : typeof userData?.roles === "string"
    ? [userData.roles]
    : [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isEmployee = roles.includes("ROLE_EMPLOYEE");

  if (!userData || (!isAdmin && !isEmployee)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-lock text-red-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </motion.div>
    );
  }

  const buttons = [
    {
      key: "dashboard",
      icon: "fas fa-chart-line",
      title: "Dashboard",
      description: "Estadísticas de ventas y productos más vendidos.",
      show: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      key: "productos",
      icon: "fas fa-boxes",
      title: "Productos",
      description: "Administra el catálogo de productos, agrega, edita o elimina artículos.",
      show: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      key: "pedidos",
      icon: "fas fa-clipboard-list",
      title: "Pedidos",
      description: "Revisa, gestiona y actualiza el estado de los pedidos de los clientes.",
      show: true,
      gradient: "from-green-500 to-teal-500",
    },
    {
      key: "usuarios",
      icon: "fas fa-users-cog",
      title: "Usuarios",
      description: "Gestiona los usuarios registrados, roles y permisos.",
      show: isAdmin,
      gradient: "from-orange-500 to-red-500",
    },
    {
      key: "parametros",
      icon: "fas fa-sliders-h",
      title: "Parámetros",
      description: "Modifica parámetros globales como costo de envío y descuento de cupón.",
      show: true,
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-tools text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-gray-600 mt-1">Gestiona tu tienda de forma eficiente</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
        >
          {buttons
            .filter((btn) => btn.show)
            .map(({ key, icon, title, description, gradient }) => (
              <motion.button
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={() => setMenu(key)}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 text-left overflow-hidden ${
                  menu === key 
                    ? "border-indigo-400 shadow-2xl" 
                    : "border-transparent hover:border-indigo-200 hover:shadow-xl"
                }`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Active indicator */}
                {menu === key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${icon} text-white text-xl`}></i>
                    </div>
                  </div>
                  <h2 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    menu === key ? "text-indigo-700" : "text-gray-800"
                  }`}>
                    {title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {description}
                  </p>
                </div>

                {/* Corner accent */}
                {menu === key && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-bl-full"></div>
                )}
              </motion.button>
            ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={menu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
          >
            {menu === "dashboard" && <AdminDashboard />}
            {menu === "productos" && <ProductoCrud />}
            {menu === "pedidos" && <PedidoCrud />}
            {menu === "parametros" && <ParametroCrud />}
            {menu === "usuarios" && isAdmin && <UserCrud />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}