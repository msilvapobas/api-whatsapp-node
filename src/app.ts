import {
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider } from "@bot-whatsapp/provider-baileys"
import express, { Request, Response, NextFunction } from "express"
import https from "https"
import { join } from "path"
import fs from "fs"
import { createReadStream } from "fs"
import dotenv from "dotenv"

const main = async () => {
  // Cargar variables de entorno
  dotenv.config()

  const app = express()
  const port = process.env.AUTH_TOKEN || 3000
  const AUTH_TOKEN = process.env.AUTH_TOKEN || "default-token"

  // Middleware para parsear cuerpos JSON
  app.use(express.json())

   // Middleware de autenticación
   const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-auth-token'];
    if (token === AUTH_TOKEN) {
      next();
    } else {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
  };


  // Crear un proveedor de baileys que manejara la conexion con WhatsApp
  const provider = createProvider(BaileysProvider)

  await createBot({
    flow: createFlow([]),
    database: new MemoryDB(),
    provider: provider,
  })

  // Leer los certificados SSL
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

  // Crear un servidor HTTPS
  const server = https.createServer(credentials, app)

  app.get("/status", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        status: "success",
        message: "Escuchando atentamente",
      })
    )
  })

  app.get("/get-qr", authenticate, async (_: Request, res: Response) => {
    const YOUR_PATH_QR = join(process.cwd(), `bot.qr.png`)
    const fileStream = createReadStream(YOUR_PATH_QR)

    res.writeHead(200, { "Content-Type": "image/png" })
    fileStream.pipe(res)
  })

  app.post("/send-message", authenticate, async (req, res) => {
    const { phone, message } = req.body
    await provider.sendMessage(phone, message, {})
    res.end(
      JSON.stringify({
        status: "success",
        message: "Mensaje enviado correctamente",
      })
    )
  })

  server.listen(port, () => {
    console.log(`Servidor seguro escuchando en el puerto ${port}`)
  })
}

main().catch(console.error)
