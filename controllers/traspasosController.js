import { Transaccion, Cuenta } from "../models/Loader.js";
import { NotFoundError, ValidationError, ForbiddenError } from "../errors/index.js";
import { recalcularBalance } from "./cuentasController.js";

export const crearTraspaso = async (req, res, next) => {
  try {
    const { cuentaOrigenId, cuentaDestinoId, importe, fecha, notas } = req.body;

    if (!cuentaOrigenId || !cuentaDestinoId || !importe || !fecha) {
      throw new ValidationError("cuentaOrigenId, cuentaDestinoId, importe y fecha son obligatorios");
    }
    if (Number(cuentaOrigenId) === Number(cuentaDestinoId)) {
      throw new ValidationError("La cuenta origen y destino no pueden ser la misma");
    }
    if (Number(importe) <= 0) {
      throw new ValidationError("El importe debe ser mayor que cero");
    }

    const [origen, destino] = await Promise.all([
      Cuenta.findByPk(cuentaOrigenId),
      Cuenta.findByPk(cuentaDestinoId),
    ]);

    if (!origen)  throw new NotFoundError("Cuenta origen no encontrada");
    if (!destino) throw new NotFoundError("Cuenta destino no encontrada");
    if (origen.userId  !== req.user.id) throw new ForbiddenError();
    if (destino.userId !== req.user.id) throw new ForbiddenError();

    const monto = Math.abs(Number(importe));

    // Crear transacción saliente (negativa)
    const salida = await Transaccion.create({
      name: `Traspaso → ${destino.nombre}`,
      total: -monto,
      type: "traspaso",
      date: fecha,
      notes: notas || null,
      cuentaId: Number(cuentaOrigenId),
      userId: req.user.id,
      traspasoParId: null, // se actualiza justo después
    });

    // Crear transacción entrante (positiva), enlazada al id de la salida
    const entrada = await Transaccion.create({
      name: `Traspaso ← ${origen.nombre}`,
      total: monto,
      type: "traspaso",
      date: fecha,
      notes: notas || null,
      cuentaId: Number(cuentaDestinoId),
      userId: req.user.id,
      traspasoParId: salida.id,
    });

    // La salida apunta al mismo parId (su propio id)
    await salida.update({ traspasoParId: salida.id });

    await recalcularBalance(Number(cuentaOrigenId));
    await recalcularBalance(Number(cuentaDestinoId));

    res.status(201).json({ salida, entrada });
  } catch (err) {
    next(err);
  }
};

export const eliminarTraspaso = async (req, res, next) => {
  try {
    const t = await Transaccion.findByPk(req.params.id);
    if (!t) throw new NotFoundError("Traspaso no encontrado");
    if (t.type !== "traspaso") throw new ValidationError("La transacción no es un traspaso");
    if (t.userId !== req.user.id) throw new ForbiddenError();

    // Buscar todas las transacciones del mismo par
    const par = await Transaccion.findAll({ where: { traspasoParId: t.traspasoParId } });
    const cuentaIds = [...new Set(par.map((p) => p.cuentaId).filter(Boolean))];

    await Transaccion.destroy({ where: { traspasoParId: t.traspasoParId } });

    await Promise.all(cuentaIds.map(recalcularBalance));

    res.json({ message: "Traspaso eliminado" });
  } catch (err) {
    next(err);
  }
};
