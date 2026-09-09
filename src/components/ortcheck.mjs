const Q = String.fromCharCode(34), NL = String.fromCharCode(10), CR = String.fromCharCode(13);
const url = 'https://docs.google.com/spreadsheets/d/1WXEeHoSV1knw8WZO25o5dyXVC7czDLkEeie67u3AvlI/export?format=csv&gid=769091894';
const t = await (await fetch(url)).text();

const rows = [];
let row = [], f = '', q = false;
for (let i = 0; i < t.length; i++) {
  const c = t[i], n = t[i + 1];
  if (q) {
    if (c === Q && n === Q) { f += Q; i++; }
    else if (c === Q) { q = false; }
    else { f += c; }
  } else {
    if (c === Q) { q = true; }
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === CR) { /* skip */ }
    else if (c === NL) { row.push(f); rows.push(row); row = []; f = ''; }
    else { f += c; }
  }
}
if (f.length || row.length) { row.push(f); rows.push(row); }

const data = rows.slice(2);
let ok = 0;
const miss = [];
for (const cols of data) {
  const name = (cols[3] || '').trim();
  const lat = parseFloat(cols[5]);
  if (!name || isNaN(lat)) continue;
  const gem = (cols[1] || '').trim();
  const unter = (cols[2] || '').trim();
  if (gem || unter) ok++;
  else miss.push(name);
}
console.log('Mit Ort:', ok);
console.log('Ohne Ort:', miss.length);
console.log('Fehlend:', miss.join(' | '));