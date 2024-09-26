import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"
import express, { Request, Response } from "express"
import http from "http"
import { join } from "path"
import { createReadStream } from "fs"

const main = async () => {
  const app = express()
  const port = 3002

  // Middleware para parsear cuerpos JSON
  app.use(express.json())

  // Crear un proveedor de baileys que manejara la conexion con WhatsApp
  const provider = createProvider(BaileysProvider)

  await createBot({
    flow: createFlow([]),
    database: new MemoryDB(),
    provider: provider,
  })

  // Crear un servidor HTTP que no sea provider y dejalo escuchando en el puerto 3002
  const server = http.createServer(app)

  app.get("/status", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        status: "success",
        message: "Escuchando atentamente",
      })
    )
  })

  app.get("/get-qr", async (_: Request, res: Response) => {
    const YOUR_PATH_QR = join(process.cwd(), `bot.qr.png`)
    const fileStream = createReadStream(YOUR_PATH_QR)

    res.writeHead(200, { "Content-Type": "image/png" })
    fileStream.pipe(res)
  })


  app.post("/send-message", async (req, res) => {
    const { phone, message } = req.body;
    await provider.sendMessage(phone, message, {});
    res.end(
      JSON.stringify({
        status: "success",
        message: "Mensaje enviado correctamente",
      })
    );
  })

  server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
  })
}

main().catch(console.error)
