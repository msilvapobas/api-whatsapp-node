const {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} = require("@bot-whatsapp/bot");
const { BaileysProvider, handleCtx } = require("@bot-whatsapp/provider-baileys");
const fs = require("fs");
const { ServerHttps } = require("./http/index.js");

const flowBienvenida = addKeyword("hola").addAnswer(
  "¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos"
);

const main = async () => {
  const provider = createProvider(BaileysProvider);

  // Lee los certificados SSL
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem",
    "utf8"
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  const server = new ServerHttps(provider, credentials);
  server.start();

  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  });
};

main();