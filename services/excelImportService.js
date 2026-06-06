import xlsx from 'xlsx';

export const procesarExcelTransacciones = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json(sheet);

  return rows.map(row => ({
    concepto: row.Concepto,
    units: Number(row.Units),
    price: Number(row.Price),
    total: Number(row.Units) * Number(row.Price),
    fecha: new Date(row.Fecha)
  }));
};
