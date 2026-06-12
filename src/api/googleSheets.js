const SHEET_ID = '1WXEeHoSV1knw8WZO25o5dyXVC7czDLkEeie67u3AvlI';
const GID = '769091894';

export async function fetchSpielplaetze() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const response = await fetch(url);
  const text = await response.text();

  const allRows = parseCSV(text);
  const rows = allRows.slice(2);

  return rows
    .map((cols, index) => {
      const name = cols[3]?.trim();
      const lat = parseFloat(cols[5]);
      const lng = parseFloat(cols[6]);

      if (!name || isNaN(lat) || isNaN(lng)) return null;

      return {
        id: index + 1,
        name: name,
        city: cols[1]?.trim() || '',
        untergemeinde: cols[2]?.trim() || '',
        strasse: cols[4]?.trim() || '',
        latitude: lat,
        longitude: lng,
        standortlink: cols[7]?.trim() || '',
        bildUrl: cols[8]?.trim() || '',
        description: cols[9]?.trim() || '',
        kategorie: cols[10]?.trim() || '',
        altersempfehlung: cols[11]?.trim() || '',
        coverImage: 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600',
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 30) + 5,
        ageGroups: cols[11]?.trim() ? [cols[11].trim()] : ['0-14'],
      };
    })
    .filter(p => p !== null);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\r') {
        // skip
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
