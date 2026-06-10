import { Op } from "sequelize";
import { Cuenta, Banco, Transaccion, Categoria, Presupuesto } from "../models/Loader.js";

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function calcularMetricas(txs) {
  const ingresos = txs.filter(t => t.type === "ingreso").reduce((s, t) => s + t.total, 0);
  const gastos   = txs.filter(t => t.type === "gasto").reduce((s, t)   => s + t.total, 0);
  const balance  = ingresos - gastos;
  const tasaAhorro = ingresos > 0 ? Math.round((balance / ingresos) * 1000) / 10 : 0;
  return {
    ingresos:    Math.round(ingresos * 100) / 100,
    gastos:      Math.round(gastos   * 100) / 100,
    balance:     Math.round(balance  * 100) / 100,
    tasaAhorro,
  };
}

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ahora  = new Date();

    // Mes/año solicitado (defecto: mes actual)
    const mesSel = req.query.mes ? parseInt(req.query.mes, 10) - 1 : ahora.getMonth();
    const añoSel = req.query.año ? parseInt(req.query.año, 10)     : ahora.getFullYear();

    // Mes anterior al seleccionado (maneja cambio de año)
    const mesAnt = mesSel === 0 ? 11 : mesSel - 1;
    const añoAnt = mesSel === 0 ? añoSel - 1 : añoSel;

    // Rangos de fechas
    const inicioMesActual   = new Date(añoSel, mesSel,     1);
    const finMesActual      = new Date(añoSel, mesSel + 1, 0, 23, 59, 59);
    const inicioMesAnterior = new Date(añoAnt, mesAnt,     1);
    const finMesAnterior    = new Date(añoAnt, mesAnt + 1, 0, 23, 59, 59);
    const inicioSeisMeses   = new Date(añoSel, mesSel - 5, 1);

    // ── Cuentas propias ──────────────────────────────────────────────────────
    const cuentas = await Cuenta.findAll({
      where: { userId, activa: true },
      include: [{ model: Banco, as: "banco", attributes: ["nombre"] }],
      order: [["createdAt", "ASC"]],
    });

    const patrimonioTotal = Math.round(
      cuentas.reduce((s, c) => s + (c.balance || 0), 0) * 100
    ) / 100;

    // ── Transacciones (mes actual + mes anterior + 6 meses) ─────────────────
    const txsTodas = await Transaccion.findAll({
      where: {
        userId,
        type:  { [Op.in]: ["ingreso", "gasto"] },
        date:  { [Op.gte]: inicioSeisMeses },
      },
      attributes: ["type", "total", "category", "cuentaId", "date"],
    });

    const txMesActual   = txsTodas.filter(t => { const d = new Date(t.date); return d >= inicioMesActual   && d <= finMesActual;   });
    const txMesAnterior = txsTodas.filter(t => { const d = new Date(t.date); return d >= inicioMesAnterior && d <= finMesAnterior; });

    const mesActual   = calcularMetricas(txMesActual);
    const mesAnterior = calcularMetricas(txMesAnterior);

    const diferencias = {
      ingresos:   Math.round((mesActual.ingresos   - mesAnterior.ingresos)   * 100) / 100,
      gastos:     Math.round((mesActual.gastos     - mesAnterior.gastos)     * 100) / 100,
      balance:    Math.round((mesActual.balance    - mesAnterior.balance)    * 100) / 100,
      tasaAhorro: Math.round((mesActual.tasaAhorro - mesAnterior.tasaAhorro) * 10)  / 10,
    };

    // ── Gastos por categoría (mes actual) ────────────────────────────────────
    const gastosPorCatMap = {};
    txMesActual.filter(t => t.type === "gasto").forEach(t => {
      const cat = t.category || "Sin categoría";
      gastosPorCatMap[cat] = (gastosPorCatMap[cat] || 0) + t.total;
    });

    const categorias = await Categoria.findAll({ where: { userId }, attributes: ["nombre", "color", "icono"] });
    const colorMap   = Object.fromEntries(categorias.map(c => [c.nombre, c.color]));
    const iconoMap   = Object.fromEntries(categorias.map(c => [c.nombre, c.icono]));

    const gastosPorCategoria = Object.entries(gastosPorCatMap)
      .map(([categoria, total]) => ({
        categoria,
        total: Math.round(total * 100) / 100,
        color: colorMap[categoria] || "#6366f1",
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // ── Evolución últimos 6 meses ────────────────────────────────────────────
    const evMap = {};
    txsTodas.forEach(t => {
      const d   = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!evMap[key]) evMap[key] = { ingresos: 0, gastos: 0 };
      if (t.type === "ingreso") evMap[key].ingresos += t.total;
      else                      evMap[key].gastos   += t.total;
    });

    const evolucionMensual = Array.from({ length: 6 }, (_, i) => {
      const d   = new Date(añoSel, mesSel - (5 - i), 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const datos = evMap[key] || { ingresos: 0, gastos: 0 };
      return {
        mes:      MESES[d.getMonth()],
        ingresos: Math.round(datos.ingresos * 100) / 100,
        gastos:   Math.round(datos.gastos   * 100) / 100,
      };
    });

    // ── Movimientos recientes (últimos 5 del mes seleccionado) ──────────────
    const movimientosRecientes = await Transaccion.findAll({
      where: {
        userId,
        date: { [Op.between]: [inicioMesActual, finMesActual] },
      },
      order: [["date", "DESC"]],
      limit: 5,
    });

    // ── Presupuestos en alerta (≥ 80 %) ─────────────────────────────────────
    const presupuestos = await Presupuesto.findAll({
      where: { userId },
      include: [{ model: Categoria, as: "categoria", attributes: ["nombre", "color", "icono"] }],
    });

    const presupuestosAlerta = [];
    for (const p of presupuestos) {
      const gastadoWhere = {
        userId,
        type:     "gasto",
        category: p.categoria.nombre,
        date:     { [Op.between]: [inicioMesActual, finMesActual] },
      };
      if (p.cuentaId) gastadoWhere.cuentaId = p.cuentaId;

      const gastado    = await Transaccion.sum("total", { where: gastadoWhere }) || 0;
      const porcentaje = Math.round((gastado / p.importe) * 100);

      if (porcentaje >= 80) {
        presupuestosAlerta.push({
          id:         p.id,
          categoria:  p.categoria.nombre,
          icono:      p.categoria.icono,
          color:      p.categoria.color,
          gastado:    Math.round(gastado * 100) / 100,
          limite:     p.importe,
          porcentaje,
          estado:     porcentaje >= 100 ? "superado" : "aviso",
        });
      }
    }

    res.json({
      patrimonioTotal,
      mesActual,
      mesAnterior,
      movimientosRecientes: movimientosRecientes.map(t => ({
        id:       t.id,
        concepto: t.name,
        total:    t.total,
        fecha:    t.date,
        type:     t.type,
        categoria: t.category,
        color:    colorMap[t.category] || "#6366f1",
        icono:    iconoMap[t.category] || "📦",
        cuentaId: t.cuentaId,
      })),
      diferencias,
      gastosPorCategoria,
      evolucionMensual,
      cuentas: cuentas.map(c => ({
        id:      c.id,
        nombre:  c.nombre,
        banco:   c.banco?.nombre,
        balance: c.balance,
        moneda:  c.moneda,
      })),
      presupuestosAlerta,
    });
  } catch (error) {
    next(error);
  }
};
