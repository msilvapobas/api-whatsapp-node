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
import express, { Request, Response } from "express"

const flowBienvenida = addKeyword("hola").addAnswer(
  "¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos"
)

const main = async () => {
  const provider = createProvider(BaileysProvider)

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

  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  })

  const app = express()

  // Middleware para parsear JSON
  app.use(express.json())

  // Define las rutas antes de iniciar el servidor
  app.get("/status", (_req: Request, res: Response) => {
    res.json({
      status: "success",
      message: "Escuchando atentamente",
    });
  });

  app.post(
    "/send-message",
    handleCtx(async (bot, req, res) => {
      const { phone, message } = req.body
      console.log({ phone, message })
      await bot.sendMessage(phone, message, {})
      res.json({
        status: "success",
        message: "Mensaje enviado correctamente",
      })
    })
  )

  // Inicia el servidor HTTPS
  https.createServer(credentials, app).listen(3002, () => {
    console.log("Servidor HTTPS corriendo en el puerto 3002")
  })
}

main()