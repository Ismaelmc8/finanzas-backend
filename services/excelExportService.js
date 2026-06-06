import xlsx from 'xlsx';

const CABECERAS = ['Fecha', 'Nombre', 'Categoría', 'Unidades', 'Precio', 'Total', 'Tipo', 'Notas'];

function formatearFila(t) {
  const tipo = t.type === 'ingreso' ? 'Ingreso' : t.type === 'gasto' ? 'Gasto' : 'Traspaso';
  return [
    new Date(t.date).toLocaleDateString('es-ES'),
    t.name    || '',
    t.category || '',
    t.units   ?? '',
    t.price   ?? '',
    t.total   ?? '',
    tipo,
    t.notes   || '',
  ];
}

export const generarExcel = (transacciones) => {
  const datos = [CABECERAS, ...transacciones.map(formatearFila)];
  const ws = xlsx.utils.aoa_to_sheet(datos);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Movimientos');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

export const generarCSV = (transacciones) => {
  const datos = [CABECERAS, ...transacciones.map(formatearFila)];
  const ws = xlsx.utils.aoa_to_sheet(datos);
  // BOM (﻿) para que Excel detecte UTF-8 correctamente
  return '﻿' + xlsx.utils.sheet_to_csv(ws);
};
