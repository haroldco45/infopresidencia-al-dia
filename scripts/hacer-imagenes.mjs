// Crea con fotos reales: og.jpg (vista previa del enlace), flyer.jpg (post) y flyer-historia.jpg (estados/historias)
// Uso: node scripts/hacer-imagenes.mjs [foto-local.jpg]   — sin argumento baja la foto real de la Casa de Nariño
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const URL_APP = 'infopresidencia-al-dia.netlify.app';
const FOTOS = [
  'https://commons.wikimedia.org/wiki/Special:FilePath/Casa_presidencial_de_Bogot%C3%A1.jpg?width=2000',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Costado2_Casa_de_Nari%C3%B1o.jpg?width=2000'
];

async function foto() {
  if (process.argv[2]) return readFile(process.argv[2]);
  for (const u of FOTOS) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'VibrasPositivasHM/1.0 (infopresidencia-al-dia)' } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
    } catch {}
  }
  throw new Error('No se pudo bajar la foto');
}

const F = `font-family="DejaVu Sans, Arial, sans-serif"`;
const fila = (x, y, w, color, tit, txt, s) => `
  <rect x="${x}" y="${y}" width="${w}" height="${s * 2.6}" rx="${s * 0.5}" fill="#0f1530" fill-opacity="0.88" stroke="#243056"/>
  <rect x="${x}" y="${y + s * 0.5}" width="${s * 0.28}" height="${s * 1.6}" rx="${s * 0.14}" fill="${color}"/>
  <text x="${x + s * 0.9}" y="${y + s * 1.15}" ${F} font-size="${s * 0.62}" font-weight="700" fill="${color}" letter-spacing="1">${tit}</text>
  <text x="${x + s * 0.9}" y="${y + s * 2.0}" ${F} font-size="${s * 0.68}" fill="#eef2ff">${txt}</text>`;

function capa(w, h, tipo) {
  const deg = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0b1020" stop-opacity="0.25"/><stop offset="0.45" stop-color="#0b1020" stop-opacity="0.7"/>
    <stop offset="1" stop-color="#0b1020" stop-opacity="0.97"/></linearGradient>
    <linearGradient id="o" x1="0" x2="1"><stop offset="0" stop-color="#f6c445"/><stop offset="0.5" stop-color="#ff7a59"/><stop offset="1" stop-color="#a77bff"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>`;
  const vivo = (x, y, s) => `<rect x="${x}" y="${y}" width="${s * 13.4}" height="${s * 1.7}" rx="${s * 0.85}" fill="#ff4d5e" fill-opacity="0.2" stroke="#ff4d5e"/>
    <circle cx="${x + s * 0.9}" cy="${y + s * 0.85}" r="${s * 0.32}" fill="#ff4d5e"/>
    <text x="${x + s * 1.6}" y="${y + s * 1.17}" ${F} font-size="${s * 0.85}" font-weight="700" fill="#ffd0d5">EN VIVO · CADA 30 MIN</text>`;

  if (tipo === 'og') return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${deg}
    ${vivo(60, 60, 26)}
    <text x="60" y="300" ${F} font-size="74" font-weight="900" fill="#fff">InfoPresidencia al Día</text>
    <text x="60" y="380" ${F} font-size="46" font-weight="900" fill="url(#o)">Cada desmentido, con las dos versiones</text>
    <text x="60" y="450" ${F} font-size="27" fill="#d6ddf5">Presidencia · prensa y críticos · lo verificado · derecho de petición</text>
    <rect x="60" y="500" width="${w - 120}" height="76" rx="38" fill="#f6c445"/>
    <text x="${w / 2}" y="550" text-anchor="middle" ${F} font-size="36" font-weight="900" fill="#1a1200">${URL_APP}</text>
    <text x="${w - 60}" y="${h - 22}" text-anchor="end" ${F} font-size="20" fill="#9aa6c9">Vibras Positivas HM · app ciudadana independiente</text></svg>`;

  const s = w / 26, alto = tipo === 'historia';
  let y = alto ? h * 0.30 : h * 0.20;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${deg}
    ${vivo(s * 1.6, s * 1.8, s)}
    <text x="${s * 1.6}" y="${y}" ${F} font-size="${s * 2.6}" font-weight="900" fill="#fff">InfoPresidencia</text>
    <text x="${s * 1.6}" y="${y + s * 2.6}" ${F} font-size="${s * 2.6}" font-weight="900" fill="#f6c445">al Día</text>
    <text x="${s * 1.6}" y="${y + s * 4.6}" ${F} font-size="${s * 1.45}" font-weight="900" fill="url(#o)">Cada desmentido,</text>
    <text x="${s * 1.6}" y="${y + s * 6.3}" ${F} font-size="${s * 1.45}" font-weight="900" fill="url(#o)">con las dos versiones</text>
    ${[['#3d7bff', 'LO QUE DICE LA PRESIDENCIA', 'Cada desmentido de @infopresidencia'],
       ['#ff4d5e', 'LO QUE DICEN PRENSA Y CRÍTICOS', 'La otra versión, con sus fuentes'],
       ['#2fd08a', 'LO VERIFICADO', 'Fechas, cifras y documentos públicos'],
       ['#f6c445', 'LO QUE FALTA SABER', 'Y un derecho de petición para exigirlo']]
      .map((r, i) => fila(s * 1.6, y + s * (7.6 + i * 3.0), w - s * 3.2, r[0], r[1], r[2], s)).join('')}
    <text x="${s * 1.6}" y="${y + s * 20.2}" ${F} font-size="${s * 0.8}" fill="#d6ddf5">Noticias en vivo · Español / English · Gratis</text>
    <rect x="${s * 1.6}" y="${h - s * (alto ? 6.5 : 4.4)}" width="${w - s * 3.2}" height="${s * 2.3}" rx="${s * 1.15}" fill="#f6c445"/>
    <text x="${w / 2}" y="${h - s * (alto ? 5.0 : 2.9)}" text-anchor="middle" ${F} font-size="${s * 0.98}" font-weight="900" fill="#1a1200">${URL_APP}</text>
    <text x="${w / 2}" y="${h - s * (alto ? 3.1 : 1.1)}" text-anchor="middle" ${F} font-size="${s * 0.6}" fill="#9aa6c9">Vibras Positivas HM · App ciudadana independiente, sin partido</text></svg>`;
}

const base = await foto();
for (const [arch, w, h, tipo] of [['og.jpg', 1200, 630, 'og'], ['flyer.jpg', 1080, 1350, 'post'], ['flyer-historia.jpg', 1080, 1920, 'historia']]) {
  const fondo = await sharp(base).resize(w, h, { fit: 'cover', position: tipo === 'og' ? 'center' : 'top' }).modulate({ saturation: 1.1 }).toBuffer();
  await writeFile(arch, await sharp(fondo).composite([{ input: Buffer.from(capa(w, h, tipo)) }]).jpeg({ quality: 86 }).toBuffer());
  console.log('Listo', arch);
}
