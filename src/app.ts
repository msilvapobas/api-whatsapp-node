import https from 'https';
import fs from 'fs';
import polka from 'polka';
import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

const flowBienvenida = addKeyword("hola")
  .addAnswer("¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos");

const main = async () => {
  const provider = createProvider(BaileysProvider);

  // Leer los archivos del certificado SSL
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem', 'utf8');

  const credentials = { key: privateKey, cert: certificate, ca: ca };

  // Inicializar el bot
  const bot = await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  });

  // Crear servidor Polka
  const app = polka();

  app.get('/status', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
        message: "Escuchando atentamente",
      })
    );
  });

  app.post('/send-message', handleCtx(async (bot, req, res) => {
    const { phone, message } = req.body;
    console.log({ phone, message });
    await bot.sendMessage(phone, message, {});
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
        message: "Mensaje enviado correctamente",
      })
    );
  }));

  // Crear servidor HTTPS
  const httpsServer = https.createServer(credentials, (req, res) => {
    app.handler(req as any, res);
  });

  httpsServer.listen(3002, () => {
    console.log('HTTPS Server running on port 3002');
  });
};

main();