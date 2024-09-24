export interface ServerHttpsConfig {
  key: string;
  cert: string;
  ca: string;
}

export class ServerHttps {
  constructor(bot: any, config: ServerHttpsConfig);
  buildApp(): any;
  start(): void;
}