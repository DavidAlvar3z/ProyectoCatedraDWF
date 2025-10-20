import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getUserNotifications, markNotificationRead } from "../services/notificationService";

export default function Header({ onSearch, showSearch = false, title = "Tienda", subtitle = "Encuentra todo lo que necesitas" }) {
  const { token, userData, logout } = useContext(AuthContext);
  const { carrito } = useContext(CartContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tab, setTab] = useState("no-leidas");
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef();
  const menuRef = useRef();
  const userId = userData?.userId;

  useEffect(() => {
    if (token && userId) {
      getUserNotifications(userId).then(setNotifications).catch(console.error);
    }
  }, [token, userId]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.estado === "ENVIADA").length;
  const filtered = tab === "todas"
    ? notifications
    : notifications.filter(n => n.estado === "ENVIADA");

  const handleMarkRead = async id => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, estado: "LEIDA" } : n)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = action => {
    setMenuOpen(false);
    if (action === "logout") {
      logout();
      navigate("/login", { replace: true });
    } else if (action === "user") {
      navigate("/profile");
    } else if (action === "admin") {
      navigate("/admin");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const isUser = userData?.roles?.includes('ROLE_USER');
  const isAdmin = userData?.roles?.includes('ROLE_ADMIN');
  const isEmployee = userData?.roles?.includes('ROLE_EMPLOYEE');

  const handleLogoClick = () => {
    if (isUser) {
      navigate('/user');
    } else if (isAdmin || isEmployee) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        {/* Primera fila: Logo + Iconos */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
            className="flex items-center space-x-2 font-bold text-xl text-gray-800 bg-transparent border-none cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <span className="hidden sm:inline">
              Tienda<span className="text-indigo-600">Ecommerce</span>
            </span>
          </motion.button>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors"
                    onClick={() => setNotifOpen(o => !o)}
                  >
                    <i className="fas fa-bell text-gray-700"></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="flex border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                          <button
                            className={`flex-1 py-3 font-semibold transition-colors ${tab === "no-leidas" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
                            onClick={() => setTab("no-leidas")}
                          >
                            No leídas
                          </button>
                          <button
                            className={`flex-1 py-3 font-semibold transition-colors ${tab === "todas" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
                            onClick={() => setTab("todas")}
                          >
                            Todas
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-2">
                          {filtered.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay notificaciones</p>
                          ) : (
                            filtered.map(n => (
                              <motion.div
                                key={n.id}
                                whileHover={{ x: 5 }}
                                className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${n.estado === "ENVIADA" ? "bg-indigo-50 hover:bg-indigo-100" : "bg-gray-50 hover:bg-gray-100"}`}
                                onClick={() => handleMarkRead(n.id)}
                              >
                                <p className={`text-sm ${n.estado === "ENVIADA" ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                                  {n.mensaje}
                                </p>
                                <small className="text-xs text-gray-400">
                                  {new Date(n.fechaEnvio).toLocaleString()}
                                </small>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                {isUser && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors"
                    onClick={() => navigate('/user/cart')}
                  >
                    <i className="fas fa-shopping-cart text-gray-700"></i>
                    {carrito?.items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {carrito.items.length}
                      </span>
                    )}
                  </motion.button>
                )}

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md"
                    onClick={() => setMenuOpen(m => !m)}
                  >
                    <i className="fas fa-user text-white"></i>
                  </motion.button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        {userData.roles.includes("ROLE_USER") && (
                          <li className="py-3 px-4 hover:bg-indigo-50 cursor-pointer text-gray-800 font-medium transition-colors flex items-center gap-2" onClick={() => handleAction("user")}>
                            <i className="fas fa-user-circle text-indigo-500"></i>
                            Mi Perfil
                          </li>
                        )}
                        {userData.roles.includes("ROLE_ADMIN") && (
                          <li className="py-3 px-4 hover:bg-indigo-50 cursor-pointer text-gray-800 font-medium transition-colors flex items-center gap-2" onClick={() => handleAction("admin")}>
                            <i className="fas fa-user-shield text-indigo-500"></i>
                            Admin Panel
                          </li>
                        )}
                        {userData.roles.includes("ROLE_EMPLOYEE") && (
                          <li className="py-3 px-4 hover:bg-indigo-50 cursor-pointer text-gray-800 font-medium transition-colors flex items-center gap-2" onClick={() => handleAction("admin")}>
                            <i className="fas fa-user-tie text-indigo-500"></i>
                            Empleado Panel
                          </li>
                        )}
                        <li className="py-3 px-4 hover:bg-red-50 cursor-pointer text-red-600 font-medium transition-colors border-t flex items-center gap-2" onClick={() => handleAction("logout")}>
                          <i className="fas fa-sign-out-alt"></i>
                          Cerrar Sesión
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            <i className="fas fa-bars text-gray-700"></i>
          </motion.button>
        </div>

        {/* Segunda fila: Sección de búsqueda (solo si showSearch = true) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4 border-t border-gray-100 pt-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Title Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-store text-white text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                  </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex-1 md:max-w-md"
                >
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-5 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm hover:border-indigo-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => {
                          setSearchQuery('');
                          if (onSearch) onSearch('');
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {!token ? (
                  <>
                    <Link to="/login" className="py-3 px-4 text-gray-700 hover:bg-indigo-50 rounded-xl font-medium transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-center">
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <button className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl text-left" onClick={() => { setMobileMenuOpen(false); setNotifOpen(true); }}>
                      <i className="fas fa-bell text-indigo-500"></i>
                      <span>Notificaciones</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {isUser && (
                      <button className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl text-left" onClick={() => { setMobileMenuOpen(false); navigate('/user/cart'); }}>
                        <i className="fas fa-shopping-cart text-indigo-500"></i>
                        <span>Carrito</span>
                        {carrito?.items?.length > 0 && (
                          <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {carrito.items.length}
                          </span>
                        )}
                      </button>
                    )}
                    {userData.roles.includes("ROLE_USER") && (
                      <button className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl text-left" onClick={() => { setMobileMenuOpen(false); handleAction("user"); }}>
                        <i className="fas fa-user text-indigo-500"></i>
                        <span>Mi Perfil</span>
                      </button>
                    )}
                    {userData.roles.includes("ROLE_ADMIN") && (
                      <button className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl text-left" onClick={() => { setMobileMenuOpen(false); handleAction("admin"); }}>
                        <i className="fas fa-user-shield text-indigo-500"></i>
                        <span>Admin Panel</span>
                      </button>
                    )}
                    {userData.roles.includes("ROLE_EMPLOYEE") && (
                      <button className="flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl text-left" onClick={() => { setMobileMenuOpen(false); handleAction("admin"); }}>
                        <i className="fas fa-user-tie text-indigo-500"></i>
                        <span>Empleado Panel</span>
                      </button>
                    )}
                    <button className="flex items-center gap-3 py-3 px-4 hover:bg-red-50 text-red-600 rounded-xl text-left border-t" onClick={() => { setMobileMenuOpen(false); handleAction("logout"); }}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}