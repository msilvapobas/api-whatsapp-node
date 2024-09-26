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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = require("path");
const fs_1 = require("fs");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = 3002;
    // Middleware para parsear cuerpos JSON
    app.use(express_1.default.json());
    // Crear un proveedor de baileys que manejara la conexion con WhatsApp
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    yield (0, bot_1.createBot)({
        flow: (0, bot_1.createFlow)([]),
        database: new bot_1.MemoryDB(),
        provider: provider,
    });
    // Crear un servidor HTTP que no sea provider y dejalo escuchando en el puerto 3002
    const server = http_1.default.createServer(app);
    app.get("/status", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            status: "success",
            message: "Escuchando atentamente",
        }));
    });
    app.get("/get-qr", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const YOUR_PATH_QR = (0, path_1.join)(process.cwd(), `bot.qr.png`);
        const fileStream = (0, fs_1.createReadStream)(YOUR_PATH_QR);
        res.writeHead(200, { "Content-Type": "image/png" });
        fileStream.pipe(res);
    }));
    // app.post("/send-message", async (req: Request, res: Response) => {
    //   // const bot = await createBot({
    //   //   flow: createFlow([]),
    //   //   database: new MemoryDB(),
    //   //   provider: provider,
    //   // });
    //   handleCtx( async (bot, req, res) => {
    //     if (!bot) {
    //       res.status(500).json({ status: "error", message: "Bot no inicializado" });
    //       return;
    //     }
    //     const { phone, message } = req.body;
    //     console.log({ phone, message });
    //     await bot.sendMessage(phone, message, {});
    //     res.setHeader("Content-Type", "application/json");
    //     res.end(
    //       JSON.stringify({
    //         status: "success",
    //         message: "Mensaje enviado correctamente",
    //       })
    //     );
    //   })(req, res);
    // })
    app.post("/send-message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone, message } = req.body;
        yield provider.sendMessage(phone, message, {});
        res.end(JSON.stringify({
            status: "success",
            message: "Mensaje enviado correctamente",
        }));
    }));
    // provider.http?.server.post(
    //   "/send-message",
    //   handleCtx(async (bot, req, res) => {
    //     const { phone, message } = req.body;
    //     console.log({ phone, message });
    //     await bot.sendMessage(phone, message, {});
    //     res.setHeader("Content-Type", "application/json");
    //     res.end(
    //       JSON.stringify({
    //         status: "success",
    //         message: "Mensaje enviado correctamente",
    //       })
    //     );
    //   })
    // );
    server.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
});
main().catch(console.error);
