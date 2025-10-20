import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkoutPedido } from '../services/pedidoService';
import { getByUserDirecciones, saveDireccion } from '../services/direccionService';
import MySwal from '../utils/swal';
import { secureGetItem } from '../utils/secureStorage';
import AddressPicker from './AddressPicker';
import { CartContext } from '../context/CartContext';
import { getParametroByClave } from '../services/parametroService';

const paymentOptions = [
  { label: 'Tarjeta de Crédito', value: 'TARJETA_CREDITO', icon: 'fas fa-credit-card' },
  { label: 'PayPal', value: 'PAYPAL', icon: 'fab fa-paypal' },
  { label: 'Efectivo', value: 'EFECTIVO', icon: 'fas fa-money-bill-wave' },
  { label: 'Transferencia Bancaria', value: 'TRANSFERENCIA_BANCARIA', icon: 'fas fa-university' }
];

const fieldConfigs = {
  TARJETA_CREDITO: [
    { name: 'card', label: 'Número de Tarjeta', regex: /^\d{4} \d{4} \d{4} \d{4}$/, icon: 'fas fa-credit-card' },
    { name: 'expiry', label: 'Fecha de Expiración', regex: /^(0[1-9]|1[0-2])\/\d{2}$/, icon: 'fas fa-calendar' }
  ],
  PAYPAL: [
    { name: 'paypalAccount', label: 'Correo de PayPal', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, icon: 'fas fa-envelope' }
  ],
  TRANSFERENCIA_BANCARIA: [
    { name: 'transferencia', label: 'Número de Cuenta', regex: /^\d{20}$/, icon: 'fas fa-university' }
  ],
  EFECTIVO: []
};

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { envio } = useContext(CartContext);
  const [descuentoCupon, setDescuentoCupon] = useState(null);
  const [envioValor, setEnvioValor] = useState(null);
  const total = state?.total || 0;
  const [hasCupon, setHasCupon] = useState(false);

  const [form, setForm] = useState({
    nombre: '', tipoPago: '', cuponCodigo: '',
    direccionId: '', alias: '', calle: '', ciudad: '', departamento: '',
    latitud: null, longitud: null,
    card: '', expiry: '', paypalAccount: '', transferencia: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [direcciones, setDirecciones] = useState([]);
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const fetchDescuento = async () => {
      try {
        const param = await getParametroByClave('descuento_cupon');
        setDescuentoCupon(param && param.valor ? Number(param.valor) / 100 : 0.15);
      } catch (e) {
        setDescuentoCupon(0.15);
      }
    };
    const fetchEnvio = async () => {
      try {
        const param = await getParametroByClave('costo_envio');
        setEnvioValor(param && param.valor ? Number(param.valor) : (envio ?? 5));
      } catch (e) {
        setEnvioValor(envio ?? 5);
      }
    };
    fetchDescuento();
    fetchEnvio();
  }, [envio]);

  const roundToTwo = (num) => Math.round(num * 100) / 100;

  const envioFinal = envioValor !== null ? envioValor : envio ?? 5;
  const descuentoFinal = descuentoCupon !== null ? descuentoCupon : 0.15;
  const porcentajeDescuento = descuentoCupon !== null ? (descuentoCupon * 100).toFixed(0) : "15";
  const subtotal = roundToTwo(total - envioFinal);
  const discount = hasCupon ? roundToTwo(subtotal * descuentoFinal) : 0;
  const totalWithDiscount = roundToTwo(subtotal - discount + envioFinal);

  useEffect(() => {
    const uid = parseInt(secureGetItem('userId'), 10);
    if (uid) {
      getByUserDirecciones(uid)
        .then(setDirecciones)
        .catch(console.error);
    }
  }, []);

  const handleChange = e => {
    let { name, value } = e.target;
    if (name === 'card') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
    }
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const validateForm = () => {
    const err = {};
    let ok = true;
    if (!form.nombre.trim()) { err.nombre = 'Requerido'; ok = false; }
    if (!form.tipoPago) { err.tipoPago = 'Requerido'; ok = false; }
    if (addingNew) {
      if (!form.alias.trim()) { err.alias = 'Alias requerido'; ok = false; }
      if (!form.calle.trim()) { err.calle = 'Calle requerida'; ok = false; }
      if (!form.ciudad.trim()) { err.ciudad = 'Ciudad requerida'; ok = false; }
      if (!form.departamento.trim()) { err.departamento = 'Departamento requerido'; ok = false; }
      if (!form.latitud || !form.longitud) {
        err.latitud = 'Debe seleccionar la ubicación en el mapa';
        ok = false;
      }
    } else {
      if (!form.direccionId || form.direccionId === 'nueva') {
        err.direccionId = 'Debe seleccionar o crear una dirección';
        ok = false;
      }
    }
    (fieldConfigs[form.tipoPago] || []).forEach(fld => {
      if (!fld.regex.test(form[fld.name] || '')) {
        err[fld.name] = 'Formato inválido';
        ok = false;
      }
    });
    if (hasCupon && !form.cuponCodigo.trim()) {
      err.cuponCodigo = 'Ingrese un cupón válido';
      ok = false;
    }
    setErrors(err);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const idCarrito = parseInt(secureGetItem('carritoId'), 10);
      if (!idCarrito) throw new Error('Carrito no disponible');
      let dirId = form.direccionId;
      if (addingNew) {
        const uid = parseInt(secureGetItem('userId'), 10);
        const nueva = {
          alias: form.alias,
          calle: form.calle,
          ciudad: form.ciudad,
          departamento: form.departamento,
          latitud: form.latitud,
          longitud: form.longitud,
        };
        const respDir = await saveDireccion(nueva, uid);
        dirId = respDir.idDireccion;
      }
      if (!dirId || dirId === 'nueva') {
        throw new Error('Debe seleccionar o crear una dirección válida');
      }
      const payload = {
        idCarrito,
        tipoPago: form.tipoPago,
        cuponCodigo: hasCupon ? form.cuponCodigo.trim() : null,
        idDireccion: dirId,
      };
      const resp = await checkoutPedido(payload);
      let orderId = resp && typeof resp === 'object' && ('idPedido' in resp) ? resp.idPedido : null;
      let orderTotal = resp && typeof resp === 'object' && ('total' in resp) ? resp.total : null;

      if (!orderId && typeof resp === 'string') {
        try {
          const parsed = JSON.parse(resp);
          orderId = parsed.idPedido;
          orderTotal = parsed.total;
        } catch {}
      }

      if (!orderId) {
        await MySwal.fire('¡Compra Exitosa!', `Pedido realizado correctamente.`, 'success');
      } else {
        sessionStorage.setItem('orderNumber', orderId);
        sessionStorage.setItem('orderTotal', orderTotal);
        await MySwal.fire('¡Compra Exitosa!', `Pedido #${orderId}`, 'success');
      }
      navigate('/confirmation');
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Fallo al procesar';
      try {
        const match = msg.match(/"description":"([^"]+)"/);
        if (match && match[1] && match[1].toLowerCase().includes('cupón inválido')) {
          msg = 'Cupón inválido';
        }
        if (err.errors && Array.isArray(err.errors)) {
          const found = err.errors.find(e => e.description && e.description.toLowerCase().includes('cupón inválido'));
          if (found) msg = 'Cupón inválido';
        }
      } catch {}
      await MySwal.fire('Error en la compra', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentFields = () =>
    (fieldConfigs[form.tipoPago] || []).map(fld => (
      <motion.div
        key={fld.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          <i className={`${fld.icon} mr-2 text-indigo-500`}></i>
          {fld.label}
        </label>
        <input
          id={fld.name}
          name={fld.name}
          value={form[fld.name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors[fld.name] ? 'border-red-400' : 'border-gray-200'}`}
          placeholder={fld.label}
        />
        <AnimatePresence>
          {errors[fld.name] && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs mt-1 flex items-center gap-1"
            >
              <i className="fas fa-exclamation-circle"></i>
              {errors[fld.name]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2 font-semibold"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i> Volver
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-credit-card text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Finalizar Compra
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20"
        >
          {/* Información Personal */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-user text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <i className="fas fa-signature mr-2 text-indigo-500"></i>
                Nombre Completo
              </label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.nombre ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Nombre completo"
              />
              <AnimatePresence>
                {errors.nombre && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.nombre}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Dirección de Envío</h2>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Dirección</label>
              <select
                name="direccionId"
                value={form.direccionId}
                onChange={e => {
                  const value = e.target.value;
                  setAddingNew(value === 'nueva');
                  setForm(f => ({ ...f, direccionId: value }));
                  setErrors(e => ({ ...e, direccionId: '' }));
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.direccionId ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">—Seleccione—</option>
                {direcciones.map(d => (
                  <option key={d.idDireccion} value={d.idDireccion}>
                    {d.alias} — {d.calle}, {d.ciudad}
                  </option>
                ))}
                <option value="nueva">+ Nueva Dirección</option>
              </select>
              <AnimatePresence>
                {errors.direccionId && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.direccionId}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {addingNew && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {['alias', 'calle', 'ciudad', 'departamento'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 capitalize">{field}</label>
                      <input
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors[field] ? 'border-red-400' : 'border-gray-200'}`}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      />
                      <AnimatePresence>
                        {errors[field] && (
                          <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-xs mt-1 flex items-center gap-1"
                          >
                            <i className="fas fa-exclamation-circle"></i>
                            {errors[field]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-map-pin mr-2 text-indigo-500"></i>
                      Seleccione ubicación en el mapa:
                    </p>
                    <AddressPicker onSelect={({ latitud, longitud }) => {
                      setForm(f => ({ ...f, latitud, longitud }));
                      setErrors(e => ({ ...e, latitud: '', longitud: '' }));
                    }} />
                    <AnimatePresence>
                      {(errors.latitud || errors.longitud) && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 text-xs mt-1 flex items-center gap-1"
                        >
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.latitud || errors.longitud}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Método de Pago */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-wallet text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Método de Pago</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {paymentOptions.map(opt => (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm(f => ({ ...f, tipoPago: opt.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    form.tipoPago === opt.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <i className={`${opt.icon} text-3xl mb-2 ${form.tipoPago === opt.value ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                  <p className={`text-sm font-semibold ${form.tipoPago === opt.value ? 'text-indigo-700' : 'text-gray-600'}`}>
                    {opt.label}
                  </p>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {errors.tipoPago && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1 mb-4"
                >
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.tipoPago}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {form.tipoPago && renderPaymentFields()}
            </AnimatePresence>
          </div>

          {/* Cupón */}
          <div className="mb-8">
            <motion.label
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={hasCupon}
                onChange={e => setHasCupon(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="font-semibold text-gray-700">
                <i className="fas fa-ticket-alt mr-2 text-indigo-500"></i>
                ¿Tienes un cupón de descuento?
              </span>
            </motion.label>
            <AnimatePresence>
              {hasCupon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Código de Cupón</label>
                  <input
                    name="cuponCodigo"
                    value={form.cuponCodigo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.cuponCodigo ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="Código de cupón"
                  />
                  <AnimatePresence>
                    {errors.cuponCodigo && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                      >
                        <i className="fas fa-exclamation-circle"></i>
                        {errors.cuponCodigo}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resumen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-l-4 border-indigo-500"
          >
            <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
              <i className="fas fa-receipt"></i>
              Resumen del Pedido
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Subtotal:</span>
                <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Envío:</span>
                <span className="text-gray-900 font-semibold">${envio !== undefined && envio !== null ? envio.toFixed(2) : '0.00'}</span>
              </div>
              <AnimatePresence>
                {hasCupon && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-green-700 font-medium flex items-center gap-2">
                      <i className="fas fa-tag"></i>
                      Descuento ({porcentajeDescuento}%):
                    </span>
                    <span className="text-green-600 font-semibold">-${discount.toFixed(2)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="border-t-2 border-indigo-200 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-700">Total:</span>
                <span className="text-2xl font-bold text-indigo-700">${totalWithDiscount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Botón Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i>
                <span>Finalizar Compra</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}