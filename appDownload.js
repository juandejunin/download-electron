const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require('multer');

function createApp() {
  const app = express();
  const port = process.env.PORT || 3000;


  // Configura Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Usa Multer como middleware
app.use(upload.any());


  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors())

  const downloadRoutes = require('./src/routes/downloadRoutes');
  app.use('/', downloadRoutes);

  // Ruta raíz que responde con "index.html" desde el directorio "public"
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Inicia el servidor
  const server = app.listen(port, () => {
    console.log(`Servidor Express iniciado en http://localhost:${port}`);
  });

  // Devuelve tanto la aplicación como la instancia del servidor
  return { app, server };
}

module.exports = createApp;
  