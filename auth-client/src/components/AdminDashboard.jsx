import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getGananciasTotales,
  getGananciasPorPeriodo,
  getProductosMasVendidos,
} from "../services/pedidoService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dayjs from "dayjs";

export default function AdminDashboard() {
  const [gananciasTotales, setGananciasTotales] = useState(0);
  const [gananciasPeriodo, setGananciasPeriodo] = useState(0);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);

  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [fechaFin, setFechaFin] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopProducts = useCallback(async () => {
    try {
      const raw = await getProductosMasVendidos(5);
      return Object.entries(raw).map(([nombre, cantidad]) => ({ nombre, cantidad }));
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [totales, top5, periodo] = await Promise.all([
          getGananciasTotales(),
          fetchTopProducts(),
          getGananciasPorPeriodo(fechaInicio, fechaFin),
        ]);
        setGananciasTotales(totales);
        setProductosMasVendidos(top5);
        setGananciasPeriodo(periodo);
        setError(null);
      } catch (e) {
        setError(e.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchTopProducts, fechaInicio, fechaFin]);

  const handlePeriodo = async (e) => {
    e.preventDefault();
    if (fechaFin < fechaInicio) {
      setError("La fecha final debe ser igual o posterior a la inicial.");
      return;
    }
    setLoading(true);
    try {
      const periodo = await getGananciasPorPeriodo(fechaInicio, fechaFin);
      setGananciasPeriodo(periodo);
      setError(null);
    } catch (e) {
      setError(e.message || "Error al consultar periodo");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
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
    <div className="space-y-8">
      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GANANCIAS TOTALES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-dollar-sign text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold">Ganancias Totales</h3>
            </div>
            <p className="text-5xl font-bold">
              ${gananciasTotales.toLocaleString("es-SV", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </motion.div>

        {/* GANANCIAS POR PERIODO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold">
                Periodo ({dayjs(fechaInicio).format("D MMM")} - {dayjs(fechaFin).format("D MMM")})
              </h3>
            </div>
            <p className="text-5xl font-bold mb-6">
              ${gananciasPeriodo.toLocaleString("es-SV", { minimumFractionDigits: 2 })}
            </p>
            <form onSubmit={handlePeriodo} className="flex flex-wrap gap-3">
              <input
                type="date"
                className="rounded-xl px-4 py-2 text-gray-800 border-2 border-white/30 focus:outline-none focus:border-white flex-1 min-w-[150px]"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <input
                type="date"
                className="rounded-xl px-4 py-2 text-gray-800 border-2 border-white/30 focus:outline-none focus:border-white flex-1 min-w-[150px]"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-white text-green-700 px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Actualizar
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* TOP 5 PRODUCTOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-trophy text-white text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Top 5 Productos Más Vendidos</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={productosMasVendidos}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="nombre"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #6366F1",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${value} vendidos`, "Cantidad"]}
            />
            <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
              {productosMasVendidos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
