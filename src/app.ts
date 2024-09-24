import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"
import fs from "fs"
import express, { Request, Response } from "express"
import https from "https"
import { join } from "path"
import { createReadStream } from "fs"

const flowBienvenida = addKeyword("hola").addAnswer(
  "¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos"
)

const main = async () => {
  const provider = createProvider(BaileysProvider)
  provider.initHttpServer(3003)

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

  const app = express()
  app.use(express.json())

  app.get("/status", (req: Request, res: Response) => {
    res.json({
      status: "success",
      message: "Escuchando atentamente",
    })
  })

  app.get("/get-qr", async (_: Request, res: Response) => {
    const YOUR_PATH_QR = join(process.cwd(), `bot.qr.png`)
    const fileStream = createReadStream(YOUR_PATH_QR)

    res.writeHead(200, { "Content-Type": "image/png" })
    fileStream.pipe(res)
  })

  provider.http?.server.post(
    "/send-message",
    handleCtx(async (bot, req: Request, res: Response) => {
      const { phone, message } = req.body
      console.log({ phone, message })
      if (!bot || !bot.sendMessage) {
        console.log(
          "El objeto bot no está definido o no tiene el método sendMessage"
        )
        res.status(500).json({
          status: "error",
          message:
            "El objeto bot no está definido o no tiene el método sendMessage",
        })
        return
      }
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

  const server = https.createServer(credentials, app)
  const port = process.env.PORT || 3002
  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })

  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  })
}

main()
