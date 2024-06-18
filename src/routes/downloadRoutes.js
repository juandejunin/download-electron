const express = require("express");
const router = express.Router();
const path = require("path");
const { body, validationResult } = require("express-validator");

const downloadController = require("../controller/downloadController");

const validateUrl = [body("url").isURL().withMessage("Ingrese una URL válida")];

// Ruta para la descarga real
router.post("/download", validateUrl, async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const videoUrl = req.body.url;
  console.log(videoUrl);
  const outputDir = downloadController.getDefaultDownloadDir();
  const selectedFormat = req.body.format || "mp4"; // Si no se selecciona un formato, usa mp4 por defecto

  try {
    const cleanTitle = await downloadController.obtenerTituloLimpiado(videoUrl);
    const fileName = await downloadController.descargarFormato(
      videoUrl,
      cleanTitle,
      outputDir,
      selectedFormat
    );

    const filePath = path.join(outputDir, fileName);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        return res.status(500).send('Error al enviar el archivo.');
      }
      console.log('Descarga exitosa:', fileName);
    });
  } catch (error) {
    console.error("Error en la descarga de video:", error);
    res.status(500).send("Error en la descarga de video.");
  }
});

module.exports = router;
