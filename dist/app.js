"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const express_1 = __importDefault(require("express"));
const flowBienvenida = (0, bot_1.addKeyword)("hola").addAnswer("¡Hola! Te invito a que ingreses a nuestro sitio web donde podrás gestionar tus turnos");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    // Lee los certificados SSL
    const privateKey = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem", "utf8");
    const certificate = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem", "utf8");
    const ca = fs.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem", "utf8");
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };
    yield (0, bot_1.createBot)({
        flow: (0, bot_1.createFlow)([flowBienvenida]),
        database: new bot_1.MemoryDB(),
        provider: provider,
    });
    const app = (0, express_1.default)();
    // Middleware para parsear JSON
    app.use(express_1.default.json());
    // Define las rutas antes de iniciar el servidor
    app.get("/status", (_req, res) => {
        res.json({
            status: "success",
            message: "Escuchando atentamente",
        });
    });
    app.post("/send-message", (0, provider_baileys_1.handleCtx)((bot, req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone, message } = req.body;
        console.log({ phone, message });
        yield bot.sendMessage(phone, message, {});
        res.json({
            status: "success",
            message: "Mensaje enviado correctamente",
        });
    })));
    // Inicia el servidor HTTPS
    https.createServer(credentials, app).listen(3002, () => {
        console.log("Servidor HTTPS corriendo en el puerto 3002");
    });
});
main();
