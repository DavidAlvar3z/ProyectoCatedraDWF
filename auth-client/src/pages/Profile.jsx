import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateProfile, changePassword } from '../services/userService';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Profile() {
  const { token, userData } = useContext(AuthContext);
  const userId = userData?.userId;
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de edición
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    newUsername: '',
    newEmail: '',
    currentPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState(null);

  // Estados de contraseña
  const [pwdValues, setPwdValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdMsg, setPwdMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
        setFormValues({
          newUsername: data.username,
          newEmail: data.email,
          currentPassword: '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, userId]);

  const handleProfileChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setProfileMsg(null);
    if (
      !formValues.newUsername ||
      formValues.newUsername.length < 5 ||
      formValues.newUsername.length > 20
    ) {
      setProfileMsg('El nombre de usuario debe tener entre 5 y 20 caracteres.');
      return;
    }
    if (!formValues.newEmail || !/\S+@\S+\.\S+/.test(formValues.newEmail)) {
      setProfileMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!formValues.currentPassword) {
      setProfileMsg('Por favor ingresa tu contraseña actual.');
      return;
    }
    try {
      const updated = await updateProfile({
        userId,
        currentPassword: formValues.currentPassword,
        newUsername: formValues.newUsername,
        newEmail: formValues.newEmail,
      });
      setProfile(updated);
      setProfileMsg('Perfil actualizado correctamente.');
      setEditMode(false);
    } catch (err) {
      let msg = err.message;
      try {
        const match = msg && msg.match(/"description":"([^"]+)"/);
        if (match && match[1] && match[1].toLowerCase().includes('contraseña actual incorrecta')) {
          msg = 'Contraseña incorrecta';
        }
        if (err.errors && Array.isArray(err.errors)) {
          const found = err.errors.find(e => e.description && e.description.toLowerCase().includes('contraseña actual incorrecta'));
          if (found) msg = 'Contraseña incorrecta';
        }
      } catch {}
      setProfileMsg(`Error: ${msg}`);
    }
  };

  const handlePwdChange = (e) => {
    setPwdValues({ ...pwdValues, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    setPwdMsg(null);
    if (pwdValues.newPassword.length < 8) {
      setPwdMsg('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (pwdValues.newPassword !== pwdValues.confirmPassword) {
      setPwdMsg('La nueva contraseña y su confirmación no coinciden.');
      return;
    }
    if (!pwdValues.currentPassword) {
      setPwdMsg('Por favor ingresa tu contraseña actual.');
      return;
    }
    try {
      await changePassword({
        userId,
        currentPassword: pwdValues.currentPassword,
        newPassword: pwdValues.newPassword,
      });
      setPwdMsg('Contraseña cambiada con éxito.');
      setPwdValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      let msg = err.message;
      try {
        const match = msg && msg.match(/"description":"([^"]+)"/);
        if (match && match[1] && match[1].toLowerCase().includes('contraseña actual incorrecta')) {
          msg = 'Contraseña incorrecta';
        }
        if (err.errors && Array.isArray(err.errors)) {
          const found = err.errors.find(e => e.description && e.description.toLowerCase().includes('contraseña actual incorrecta'));
          if (found) msg = 'Contraseña incorrecta';
        }
      } catch {}
      setPwdMsg(`Error: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando perfil...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
          <p className="text-red-600 font-semibold text-xl">{error}</p>
        </motion.div>
      </div>
    );
  }

  const isProfileRoot = location.pathname === '/profile';

  const sidebarLinks = [
    { to: "/profile", icon: "fas fa-user", label: "Perfil" },
    { to: "/profile/user-orders", icon: "fas fa-shopping-bag", label: "Mis Pedidos" },
    { to: "/profile/puntos", icon: "fas fa-star", label: "Historial de Puntos" },
    { to: "/profile/pedidos", icon: "fas fa-history", label: "Historial de Pedidos" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 max-w-7xl">
        {/* Sidebar Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/4"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 sticky top-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-circle text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Mi Cuenta</h2>
                <p className="text-sm text-gray-500">{profile?.username}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {sidebarLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                      location.pathname === link.to
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-indigo-50 text-gray-700 hover:text-indigo-700'
                    }`}
                  >
                    <i className={`${link.icon} text-lg ${
                      location.pathname === link.to ? 'text-white' : 'text-indigo-500'
                    }`}></i>
                    <span className="font-medium">{link.label}</span>
                    {location.pathname === link.to && (
                      <i className="fas fa-chevron-right ml-auto"></i>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="lg:w-3/4">
          <Outlet />
          {isProfileRoot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-user-circle text-white text-2xl"></i>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Información Personal
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  {editMode ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className="fas fa-user mr-2 text-indigo-500"></i>
                          Username
                        </label>
                        <input
                          name="newUsername"
                          value={formValues.newUsername}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className="fas fa-envelope mr-2 text-indigo-500"></i>
                          Email
                        </label>
                        <input
                          name="newEmail"
                          type="email"
                          value={formValues.newEmail}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className="fas fa-lock mr-2 text-indigo-500"></i>
                          Contraseña actual
                        </label>
                        <input
                          name="currentPassword"
                          type="password"
                          value={formValues.currentPassword}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        />
                      </div>
                      {profileMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl border-l-4 ${
                            profileMsg.startsWith('Error')
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : 'bg-green-50 border-green-500 text-green-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <i className={`fas ${profileMsg.startsWith('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                            <span className="font-medium">{profileMsg}</span>
                          </div>
                        </motion.div>
                      )}
                      <div className="flex gap-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpdateProfile}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <i className="fas fa-save mr-2"></i>
                          Guardar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setEditMode(false);
                            setProfileMsg(null);
                          }}
                          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancelar
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {[
                        { icon: "fas fa-user", label: "Username", value: profile.username },
                        { icon: "fas fa-envelope", label: "Email", value: profile.email },
                        { icon: "fas fa-birthday-cake", label: "Fecha de Nacimiento", value: new Date(profile.fechaNacimiento).toLocaleDateString() },
                        { icon: "fas fa-phone", label: "Teléfono", value: profile.telefono || '-' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className={`${item.icon} text-white`}></i>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                            <p className="text-gray-800 font-semibold">{item.value}</p>
                          </div>
                        </motion.div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditMode(true)}
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Editar Perfil
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Change Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-key text-white text-2xl"></i>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Cambiar Contraseña
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-lock mr-2 text-green-500"></i>
                      Contraseña actual
                    </label>
                    <input
                      name="currentPassword"
                      type="password"
                      value={pwdValues.currentPassword}
                      onChange={handlePwdChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-key mr-2 text-green-500"></i>
                      Nueva contraseña
                    </label>
                    <input
                      name="newPassword"
                      type="password"
                      value={pwdValues.newPassword}
                      onChange={handlePwdChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-check-double mr-2 text-green-500"></i>
                      Confirmar nueva contraseña
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={pwdValues.confirmPassword}
                      onChange={handlePwdChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                    />
                  </div>
                  {pwdMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border-l-4 ${
                        pwdMsg.startsWith('Error')
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-green-50 border-green-500 text-green-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className={`fas ${pwdMsg.startsWith('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        <span className="font-medium">{pwdMsg}</span>
                      </div>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <i className="fas fa-shield-alt mr-2"></i>
                    Cambiar Contraseña
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}