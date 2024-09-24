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
const { addKeyword, createBot, createFlow, createProvider, MemoryDB, } = require("@bot-whatsapp/bot");
const { BaileysProvider, handleCtx } = require("@bot-whatsapp/provider-baileys");
const fs = require("fs");
const { ServerHttps } = require("./http/index.js");
const flowBienvenida = addKeyword("hola").addAnswer("¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = createProvider(BaileysProvider);
    // Lee los certificados SSL
    const privateKey = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem", "utf8");
    const certificate = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem", "utf8");
    const ca = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem", "utf8");
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };
    const bot = yield createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider: provider,
    });
    const server = new ServerHttps(bot, credentials);
    server.start();
});
main();
