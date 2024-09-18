import {
  addKeyword,
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"

// const flowBienvenida = addKeyword("hola").addAnswer(
//   "¡Hola! Te doy la bienvenida."
// )

const flowBienvenida = addKeyword("hola").addAnswer("¡Hola! Te doy la bienvenida.").addAction((ctx: { from: string }) => {
  console.log(`Received message from: ${ctx.from}`)
})

/**
 *
 */
const main = async () => {
  const provider = createProvider(BaileysProvider)

  provider.initHttpServer(3002)

  provider.http?.server.get("status", (req, res) => {
    res.end("Estoy vivo")
  })

  provider.http?.server.post(
    "/send-message",
    handleCtx(async (bot, req, res) => {
      const {phone, message} = req.body
      console.log({ phone, message })
      await bot.sendMessage(phone, message, {})
      res.end("Esto es del server de polka")
    })
  )


  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider: provider,
  })
}

main()
