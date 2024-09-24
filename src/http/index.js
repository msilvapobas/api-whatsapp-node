const express = require("express");
const routes = require("./routes/backend-routes");
const https = require("https");

class ServerHttps {
  constructor(provider, config) {
    this.provider = provider;
    this.config = config;
  }

  buildApp() {
    const app = express()
      .use(express.json())
      .use((req, res, next) => {
        req.provider = this.provider;
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