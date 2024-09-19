"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("@bot-whatsapp/bot");
const provider_baileys_1 = require("@bot-whatsapp/provider-baileys");
// const flowBienvenida = addKeyword("hola").addAnswer(
//   "¡Hola! Te doy la bienvenida."
// )
const flowBienvenida = (0, bot_1.addKeyword)("hola").addAnswer("¡Hola! Te doy la bienvenida.").addAction((ctx) => {
    console.log(`Received message from: ${ctx.from}`);
});
/**
 *
 */
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    provider.initHttpServer(3002);
    (_a = provider.http) === null || _a === void 0 ? void 0 : _a.server.get("status", (req, res) => {
        res.end("Estoy vivo");
    });
    (_b = provider.http) === null || _b === void 0 ? void 0 : _b.server.post("/send-message", (0, provider_baileys_1.handleCtx)((bot, req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone, message } = req.body;
        console.log({ phone, message });
        yield bot.sendMessage(phone, message, {});
        res.end("Esto es del server de polka");
    })));
    yield (0, bot_1.createBot)({
        flow: (0, bot_1.createFlow)([flowBienvenida]),
        database: new bot_1.MemoryDB(),
        provider: provider,
    });
});
main();
