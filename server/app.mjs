import express from 'express';
import path from 'path';
import { connectToDb } from './mongoDb/connect.mjs';
import { veranstaltungen } from './router/veranstaltung.mjs';
import { gaeste } from './router/gaeste.mjs';
import { plaene } from './router/plaene.mjs';
import { tische } from './router/tisch.mjs';

const server = express();
// Definition des Serverports
const PORT = parseInt(process.argv[2]) || 8080;
export const BASE_URI = `http://localhost:${PORT}`;

// Middleware-Konfiguration

// URL-Codierung für Anforderungsdaten
server.use(express.urlencoded({ extended: true }));
// JSON-Codierung für Anforderungsdaten
server.use(express.json());

// Bereitstellung von statischen Dateien
server.use(
  express.static(path.join(path.dirname(process.argv[1]), './../client/dist'))
);

// Logging-Middleware
server.use((req, res, next) => {
  console.log(new Date().toUTCString(), req.ip, req.originalUrl);
  next();
});

// API-Routen definieren
server.get('/apis', (req, res) => {
  res.json({
    _links: {
      self: { href: `${BASE_URI}/apis` },
      veranstaltungen: { href: `${BASE_URI}/api/Veranstaltungen` },
      gaeste: { href: `${BASE_URI}/api/Gaeste` },
      plaene: { href: `${BASE_URI}/api/Plaene` },
      tische: { href: `${BASE_URI}/api/Tische` }
    }
  });
});

// API-Endpunkte konfigurieren
const apiRoutes = [veranstaltungen, gaeste, plaene, tische];
apiRoutes.forEach((route) => server.use('/api', route));

// MongoDB-Verbindungs-URI
const MONGO_URI = 'mongodb://localhost:27017/VeranstaltungenDB';

/**
 * Startet den Server und verbindet sich mit der Datenbank.
 */
async function startServer () {
  try {
    await connectToDb(MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting the server: ${error}`);
    process.exit(1);
  }
}

startServer();
