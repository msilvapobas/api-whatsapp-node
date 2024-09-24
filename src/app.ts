import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"
import * as fs from "fs"
import * as https from "https"
import { IncomingMessage, ServerResponse } from "http"
import polka from "polka" // Asegúrate de importar Polka si no está ya importado

// Lee los certificados SSL
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem",
  "utf8"
)
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem",
  "utf8"
)
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem",
  "utf8"
)

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
}

const flowBienvenida = addKeyword("hola").addAnswer(
  "¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos"
)

const main = async () => {
  const provider = createProvider(BaileysProvider)

  // Inicializa el servidor HTTP de Polka
  provider.initHttpServer(3002)

  // Extrae el manejador de solicitudes de Polka
  const polkaApp = provider.http?.server

  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    polkaApp!.handler(req as any, res as any)
  }

  // Configura el servidor HTTPS
  const httpsServer = https.createServer(credentials, requestHandler)

  httpsServer.listen(3002, () => {
    console.log("Servidor HTTPS escuchando en el puerto 3002")
  })

  polkaApp!.get("status", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        status: "success",
        message: "Escuchando atentamente",
      })
    )
  })

  polkaApp!.post(
    "/send-message",
    handleCtx(async (bot, req, res) => {
      const { phone, message } = req.body
      console.log({ phone, message })
      await bot.sendMessage(phone, message, {})
      res.setHeader("Content-Type", "application/json")
      res.end(
        JSON.stringify({
          status: "success",
          message: "Mensaje enviado correctamente",
        })
      )
    })
  )

  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  })
}

main()
