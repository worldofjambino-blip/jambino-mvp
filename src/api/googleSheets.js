const SHEET_ID = '1WXEeHoSV1knw8WZO25o5dyXVC7czDLkEeie67u3AvlI';
const GID = '769091894';

export async function fetchSpielplaetze() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const response = await fetch(url);
  const text = await response.text();
  
  const rows = text.split('\n').slice(2);
  
  return rows
    .map(row => {
      const cols = row.split(',');
      return {
        plz: cols[0]?.trim(),
        gemeinde: cols[1]?.trim(),
        untergemeinde: cols[2]?.trim(),
        name: cols[3]?.trim(),
        strasse: cols[4]?.trim(),
        standortlink: cols[5]?.trim(),
        bildUrl: cols[6]?.trim(),
        beschreibung: cols[7]?.trim(),
        kategorie: cols[8]?.trim(),
        alter: cols[9]?.trim(),
        besonderheiten: cols[10]?.trim(),
      };
    })
    .filter(p => p.name && p.name.length > 0);
}
