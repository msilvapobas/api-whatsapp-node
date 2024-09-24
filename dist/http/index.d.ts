export interface ServerHttpsConfig {
  key: string;
  cert: string;
  ca: string;
}

export class ServerHttps {
  constructor(_provideWs: any, config: ServerHttpsConfig);
  buildApp(): any;
  start(): void;
}