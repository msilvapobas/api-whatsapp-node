import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"


const flowBienvenida = addKeyword("hola")
  .addAnswer("¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos")
  

/**
 *
 */
const main = async () => {
  const provider = createProvider(BaileysProvider)

  provider.initHttpServer(3002)

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
