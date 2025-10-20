import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { register as registerService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    telefono: '',
    dui: '',
    direccion: ''
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "dui") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 8) {
        newValue = digits;
      } else {
        newValue = digits.slice(0, 8) + "-" + digits.slice(8, 9);
      }
    }

    if (name === "telefono") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 4) {
        newValue = digits;
      } else {
        newValue = digits.slice(0, 4) + "-" + digits.slice(4, 8);
      }
    }

    setForm({ ...form, [name]: newValue });
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.username || !form.email || !form.password || !form.confirmPassword) {
        setError('Todos los campos son requeridos');
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      if (form.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!form.primerNombre || !form.primerApellido || !form.fechaNacimiento) {
        setError('Los campos marcados con * son obligatorios');
        return false;
      }
    }

    if (currentStep === 3) {
      if (form.telefono && !/^\d{4}-\d{4}$/.test(form.telefono)) {
        setError('El teléfono debe tener el formato 1234-5678');
        return false;
      }
      if (form.dui && !/^\d{8}-\d{1}$/.test(form.dui)) {
        setError('El DUI debe tener el formato 12345678-9');
        return false;
      }
      if (form.username.length < 5) {
        setError('El nombre de usuario tiene que llevar entre 5 y 20 caracteres');
        return false;
      }
    }

    setError('');
    return true;
  };

  const nextStep = (currentStep) => {
    if (!validateStep(currentStep)) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    try {
      let fechaFormateada = form.fechaNacimiento;
      if (fechaFormateada && fechaFormateada.includes('-')) {
        const [yyyy, mm, dd] = fechaFormateada.split('-');
        fechaFormateada = `${dd}/${mm}/${yyyy}`;
      }

      const { fechaNacimiento, ...rest } = form;
      const response = await registerService({ ...rest, fechaNacimiento: fechaFormateada });
      
      if (typeof response === "string") {
        login(response);
        const decoded = jwtDecode(response);
        const roles = decoded.roles || [];
        navigate(roles.includes('ROLE_ADMIN') ? '/admin' : '/user');
      } else {
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          setError(response.errors.map(e => e.description || e.title || e.message).join(' | '));
        } else if (response && typeof response === "string") {
          setError(response);
        } else {
          setError('Error en el registro');
        }
      }
    } catch (err) {
      if (err && err.response && err.response.data) {
        if (Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
          setError(err.response.data.errors.map(e => e.description || e.title || e.message).join(' | '));
        } else if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Error en el registro');
        }
      } else if (err && err.message) {
        setError(err.message);
      } else {
        setError('Error en el registro');
      }
    }
  };

  const steps = [
    { number: 1, title: "Información básica", icon: "fas fa-user" },
    { number: 2, title: "Información personal", icon: "fas fa-id-card" },
    { number: 3, title: "Información de contacto", icon: "fas fa-address-card" }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-3xl border border-white/20"
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"></div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 p-8 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg"
            >
              <i className="fas fa-user-plus text-4xl"></i>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
            <p className="text-blue-100">Completa el formulario para registrarte</p>
          </motion.div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= s.number
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.number ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <i className={s.icon}></i>
                    )}
                  </div>
                  <p className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    step >= s.number ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    {s.title}
                  </p>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    step > s.number
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-8 pt-0">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "username", icon: "fas fa-user", label: "Usuario", type: "text" },
                      { name: "email", icon: "fas fa-envelope", label: "Email", type: "email" },
                      { name: "password", icon: "fas fa-lock", label: "Contraseña", type: "password" },
                      { name: "confirmPassword", icon: "fas fa-lock", label: "Confirmar Contraseña", type: "password" }
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative group"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className={`${field.icon} mr-2 text-indigo-500`}></i>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                          placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                          required
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => nextStep(1)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      Siguiente
                      <i className="fas fa-arrow-right"></i>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "primerNombre", icon: "fas fa-signature", label: "Primer Nombre", required: true },
                      { name: "segundoNombre", icon: "fas fa-signature", label: "Segundo Nombre", required: false },
                      { name: "primerApellido", icon: "fas fa-signature", label: "Primer Apellido", required: true },
                      { name: "segundoApellido", icon: "fas fa-signature", label: "Segundo Apellido", required: false }
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative group"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className={`${field.icon} mr-2 text-indigo-500`}></i>
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                          placeholder={field.label}
                          required={field.required}
                        />
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative group"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-calendar-alt mr-2 text-indigo-500"></i>
                        Fecha de Nacimiento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                        required
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                    >
                      <i className="fas fa-arrow-left"></i>
                      Anterior
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => nextStep(2)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      Siguiente
                      <i className="fas fa-arrow-right"></i>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-phone mr-2 text-indigo-500"></i>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                        placeholder="1234-5678"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative group"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-id-card mr-2 text-indigo-500"></i>
                        DUI <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="dui"
                        value={form.dui}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                        placeholder="12345678-9"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative group md:col-span-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-home mr-2 text-indigo-500"></i>
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white group-hover:border-indigo-300"
                        placeholder="Tu dirección completa"
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                    >
                      <i className="fas fa-arrow-left"></i>
                      Anterior
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <i className="fas fa-user-plus"></i>
                      Registrar cuenta
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1"
              >
                Inicia sesión aquí
                <i className="fas fa-arrow-right text-sm"></i>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}