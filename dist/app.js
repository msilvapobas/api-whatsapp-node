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
const https_1 = __importDefault(require("https"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("fs");
const dotenv_1 = __importDefault(require("dotenv"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Cargar variables de entorno
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const port = process.env.port || 3000;
    const AUTH_TOKEN = process.env.AUTH_TOKEN || "default-token";
    // Middleware para parsear cuerpos JSON
    app.use(express_1.default.json());
    // Middleware de autenticación
    const authenticate = (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (token === AUTH_TOKEN) {
            next();
        }
        else {
            res.status(403).json({ status: 'error', message: 'Forbidden' });
        }
    };
    // Crear un proveedor de baileys que manejara la conexion con WhatsApp
    const provider = (0, bot_1.createProvider)(provider_baileys_1.BaileysProvider);
    yield (0, bot_1.createBot)({
        flow: (0, bot_1.createFlow)([]),
        database: new bot_1.MemoryDB(),
        provider: provider,
    });
    // Leer los certificados SSL
    const privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/privkey.pem", "utf8");
    const certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/cert.pem", "utf8");
    const ca = fs_1.default.readFileSync("/etc/letsencrypt/live/cloudserver.nerdyactor.com.ar/chain.pem", "utf8");
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    };
    // Crear un servidor HTTPS
    const server = https_1.default.createServer(credentials, app);
    app.get("/status", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            status: "success",
            message: "Escuchando atentamente",
        }));
    });
    app.get("/get-qr", authenticate, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const YOUR_PATH_QR = (0, path_1.join)(process.cwd(), `bot.qr.png`);
        const fileStream = (0, fs_2.createReadStream)(YOUR_PATH_QR);
        res.writeHead(200, { "Content-Type": "image/png" });
        fileStream.pipe(res);
    }));
    app.post("/send-message", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone, message } = req.body;
        yield provider.sendMessage(phone, message, {});
        res.end(JSON.stringify({
            status: "success",
            message: "Mensaje enviado correctamente",
        }));
    }));
    server.listen(port, () => {
        console.log(`Servidor seguro escuchando en el puerto ${port}`);
    });
});
main().catch(console.error);
