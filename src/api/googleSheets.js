const SHEET_ID = '1WXEeHoSV1knw8WZO25o5dyXVC7czDLkEeie67u3AvlI';
const GID = '769091894';

export async function fetchSpielplaetze() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const response = await fetch(url);
  const text = await response.text();
  
  const rows = text.split('\n').slice(2);
  
  return rows
    .map((row, index) => {
      const cols = parseCSVRow(row);
      if (!cols[3]?.trim()) return null;
      return {
        id: index + 1,
        name: cols[3]?.trim() || '',
        city: cols[1]?.trim() || '',
        untergemeinde: cols[2]?.trim() || '',
        strasse: cols[4]?.trim() || '',
        standortlink: cols[5]?.trim() || '',
        bildUrl: cols[6]?.trim() || '',
        description: cols[7]?.trim() || '',
        kategorie: cols[8]?.trim() || '',
        altersempfehlung: cols[9]?.trim() || '',
        latitude: 47.6560 + (Math.random() - 0.5) * 0.3,
        longitude: 8.9545 + (Math.random() - 0.5) * 0.5,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviews: Math.floor(Math.random() * 50) + 5,
        equipment: {
          slide: cols[11]?.trim() === 'x',
          swing: cols[12]?.trim() === 'x',
          sandbox: cols[13]?.trim() === 'x',
          climbing: cols[14]?.trim() === 'x',
        },
        ageGroups: cols[9]?.trim() ? [cols[9].trim()] : ['0-14'],
      };
    })
    .filter(p => p !== null);
}

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '"') {
      inQuotes = !inQuotes;
    } else if (row[i] === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += row[i];
    }
  }
  result.push(current);
  return result;
}
