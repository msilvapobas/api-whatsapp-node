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

const flowBienvenida = addKeyword("hola").addAnswer(
  "¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos"
)

/**
 *
 */
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

  const server = https.createServer(credentials) // provider.initHttpServer(3002)

  provider.http?.server.get("status", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        status: "success",
        message: "Escuchando atentamente",
      })
    )
  })

  provider.http?.server.post(
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

  provider.http?.server.listen({ server, port: 3002 }, (err: Error) => {
    if (err) throw err
    console.log("Server running on port 3002")
  })

  await createBot({
    flow: createFlow([]),
    database: new MemoryDB(),
    provider: provider,
  })

  // await createBot({
  //   flow: createFlow([flowBienvenida]),
  //   database: new MemoryDB(),
  //   provider: provider,
  // })
}
//
main()
