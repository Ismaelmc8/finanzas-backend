// Ejecutar con: node scripts/migrate-grupos.js
// Convierte los Grupos existentes a Bancos + Cuentas

import "../models/Loader.js";
import { sequelize, Grupo, Transaccion, Banco, Cuenta, Usuario } from "../models/Loader.js";
import dotenv from "dotenv";
dotenv.config();

async function migrar() {
  await sequelize.authenticate();
  await sequelize.sync();

  const usuarios = await Usuario.findAll();
  if (!usuarios.length) {
    console.log("No hay usuarios. Nada que migrar.");
    return;
  }

  const grupos = await Grupo.findAll({ include: [{ model: Transaccion, as: "transaccionesGrupo" }] });
  if (!grupos.length) {
    console.log("No hay grupos que migrar.");
    return;
  }

  // Usar el primer usuario como propietario por defecto
  const userId = usuarios[0].id;
  console.log(`Migrando ${grupos.length} grupo(s) al usuario ${userId}...`);

  // Crear un banco por defecto
  const banco = await Banco.create({ nombre: "Mi banco", color: "#6366f1", icono: "🏦", userId });
  console.log(`Banco creado: ID ${banco.id}`);

  for (const grupo of grupos) {
    const cuenta = await Cuenta.create({
      nombre: grupo.name,
      tipo: "corriente",
      bancoId: banco.id,
      userId,
    });

    const transacciones = grupo.transaccionesGrupo || [];
    if (transacciones.length) {
      await Transaccion.update(
        { cuentaId: cuenta.id, userId },
        { where: { groupId: grupo.id } }
      );
    }

    // Recalcular balance
    const ingresos = transacciones.filter(t => t.type === "ingreso").reduce((s, t) => s + t.total, 0);
    const gastos   = transacciones.filter(t => t.type === "gasto").reduce((s, t) => s + t.total, 0);
    await cuenta.update({ balance: ingresos - gastos });

    console.log(`  Grupo "${grupo.name}" → Cuenta ID ${cuenta.id} (${transacciones.length} transacciones)`);
  }

  console.log("Migración completada.");
  process.exit(0);
}

migrar().catch(err => { console.error(err); process.exit(1); });
