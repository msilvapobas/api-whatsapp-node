const express = require("express");
const routes = require("./routes/backend-routes");
const https = require("https");

class ServerHttps {
  constructor(bot, config) {
    this.bot = bot;
    this.config = config;
  }

  buildApp() {
    const app = express()
      .use(express.json())
      .use((req, res, next) => {
        req.bot = this.bot;
        next();
      })
      .use(routes);
    return app;
  }

  start() {
    this.app = this.buildApp();
    this.server = https.createServer(this.config, this.app);
    const port = process.env.PORT || 3002;
    this.server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

module.exports = { ServerHttps };