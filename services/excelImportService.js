import xlsx from 'xlsx';

// Normaliza texto: minúsculas, sin acentos, sin espacios
function norm(s) {
  return (s ?? '').toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[\s\.\-_]+/g, ' ')
    .trim();
}

// Convierte número europeo "1.234,56" o "-45,20" a float
function parseImporte(v) {
  if (v === null || v === undefined || v === '') return NaN;
  if (typeof v === 'number') return v;
  const s = v.toString()
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3})/g, '')   // separador de miles
    .replace(',', '.');             // separador decimal
  return parseFloat(s);
}

// Parsea fechas en formatos DD/MM/YYYY, YYYY-MM-DD, serial Excel, o Date
function parseFecha(v) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  if (typeof v === 'number') {
    // Serial de fecha Excel (días desde 1900-01-01 con corrección Lotus)
    const d = new Date(Math.round((v - 25569) * 86400000));
    return isNaN(d.getTime()) ? null : d;
  }
  const s = v.toString().trim();
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Busca el índice de una columna comparando aliases normalizados
function findCol(headerRow, aliases) {
  return headerRow.findIndex(h => aliases.some(a => norm(h) === a));
}

export const procesarExcelTransacciones = (filePath) => {
  const wb   = xlsx.readFile(filePath, { cellDates: false });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '' });

  // ── 1. Localizar fila de cabeceras ──────────────────────────────────────
  // Buscamos en las primeras 20 filas la que contenga al menos "fecha" e "importe"
  // (formato banco) o "units" y "price" (formato interno)
  let headerIdx = -1;
  let header    = [];

  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const row   = rows[i];
    const normd = row.map(norm);
    const hasDate   = normd.some(c => ['fecha', 'fecha operacion', 'f operacion', 'f valor', 'fecha valor', 'date'].includes(c));
    const hasAmount = normd.some(c => ['importe', 'cargo/abono', 'cantidad', 'movimiento', 'price', 'importe eur'].includes(c));
    const hasConcept= normd.some(c => ['concepto', 'descripcion', 'descripcion del movimiento', 'concepto/descripcion', 'units', 'nombre'].includes(c));

    if (hasDate && (hasAmount || hasConcept)) {
      headerIdx = i;
      header = row;
      break;
    }
  }

  if (headerIdx === -1) {
    throw new Error('No se encontró una cabecera válida. Asegúrate de que el archivo contiene columnas de Fecha, Concepto e Importe.');
  }

  // ── 2. Mapear columnas ─────────────────────────────────────────────────
  const iDate    = findCol(header, ['fecha', 'fecha operacion', 'f operacion', 'f valor', 'fecha valor', 'date']);
  const iDesc    = findCol(header, ['concepto', 'descripcion', 'descripcion del movimiento', 'concepto/descripcion', 'nombre', 'movimiento']);
  const iImporte = findCol(header, ['importe', 'cargo/abono', 'cantidad', 'importe eur']);
  const iUnits   = findCol(header, ['units', 'unidades']);
  const iPrice   = findCol(header, ['price', 'precio']);
  const iNotes   = findCol(header, ['notas', 'notes', 'observaciones', 'referencia']);

  const formatoBanco   = iImporte !== -1 && iDesc !== -1 && iDate !== -1;
  const formatoInterno = iUnits   !== -1 && iPrice !== -1;

  if (!formatoBanco && !formatoInterno) {
    throw new Error('Columnas no reconocidas. El archivo debe tener al menos: Fecha, Concepto e Importe (extracto bancario) o Fecha, Concepto, Units y Price (formato interno).');
  }

  // ── 3. Parsear filas de datos ───────────────────────────────────────────
  const result = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.every(c => c === '' || c === null || c === undefined)) continue;

    const fecha   = parseFecha(row[iDate]);
    const desc    = (row[iDesc] ?? '').toString().trim();
    const notes   = iNotes !== -1 ? (row[iNotes] ?? '').toString().trim() : '';

    if (!fecha || !desc) continue;

    if (formatoBanco) {
      const importe = parseImporte(row[iImporte]);
      if (isNaN(importe) || importe === 0) continue;

      result.push({
        name:  desc,
        units: 1,
        price: Math.abs(importe),
        total: Math.abs(importe),
        type:  importe > 0 ? 'ingreso' : 'gasto',
        date:  fecha,
        notes,
      });
    } else {
      const units  = parseFloat(row[iUnits]) || 1;
      const price  = parseFloat(row[iPrice]) || 0;
      if (!price) continue;

      result.push({
        name:  desc,
        units,
        price,
        total: units * price,
        type:  'gasto',
        date:  fecha,
        notes,
      });
    }
  }

  return result;
};
