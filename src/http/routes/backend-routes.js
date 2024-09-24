const express = require("express");
const { createReadStream } = require("fs");
const { join } = require("path");
const { handleCtx } = require("@bot-whatsapp/provider-baileys");

const router = express.Router();

/**
 * Router
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStatus = async (req, res) => {
  res.json({
    status: "success",
    message: "Escuchando atentamente",
  });
};

/**
 * Controller
 */
router.get("/status", getStatus);

router.get("/get-qr", async (_, res) => {
  const YOUR_PATH_QR = join(process.cwd(), `bot.qr.png`);
  const fileStream = createReadStream(YOUR_PATH_QR);

  res.writeHead(200, { "Content-Type": "image/png" });
  fileStream.pipe(res);
});

router.post(
  "/send-message",
  handleCtx(async (bot, req, res) => {
    const { phone, message } = req.body;
    console.log({ phone, message });
    if (!bot || !bot.sendMessage) {
      console.log("El objeto bot no está definido o no tiene el método sendMessage");
      res.status(500).json({
        status: "error",
        message: "El objeto bot no está definido o no tiene el método sendMessage",
      });
      return;
    }
    await bot.sendMessage(phone, message, {});
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
        message: "Mensaje enviado correctamente",
      })
    );
  })
);

module.exports = router;