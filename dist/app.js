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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("@bot-whatsapp/bot");
const provider_baileys_1 = require("@bot-whatsapp/provider-baileys");
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const path_1 = require("path");
const fs_2 = require("fs");
const flowBienvenida = (0, bot_1.addKeyword)("hola").addAnswer("¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    // Lee los certificados SSL
    const privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem", "utf8");
    const certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem", "utf8");
    const ca = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem", "utf8");
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };
    const bot = yield (0, bot_1.createBot)({
        flow: (0, bot_1.createFlow)([flowBienvenida]),
        database: new bot_1.MemoryDB(),
        provider: provider,
    });
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/status", (req, res) => {
        res.json({
            status: "success",
            message: "Escuchando atentamente",
        });
    });
    app.get("/get-qr", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const YOUR_PATH_QR = (0, path_1.join)(process.cwd(), `bot.qr.png`);
        const fileStream = (0, fs_2.createReadStream)(YOUR_PATH_QR);
        res.writeHead(200, { "Content-Type": "image/png" });
        fileStream.pipe(res);
    }));
    // provider.initHttpServer(3002)
    app.post("/send-message", (0, provider_baileys_1.handleCtx)((bot, req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone, message } = req.body;
        console.log({ phone, message });
        if (!bot || !bot.sendMessage) {
            console.log("El objeto bot no está definido o no tiene el método sendMessage");
            res.status(500).json({
                status: "error",
                message: "El objeto bot no está definido o no tiene el método sendMessage",
            });
            return;
        }
        yield bot.sendMessage(phone, message, {});
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            status: "success",
            message: "Mensaje enviado correctamente",
        }));
    })));
    const server = https_1.default.createServer(credentials, app);
    const port = process.env.PORT || 3002;
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
main();
