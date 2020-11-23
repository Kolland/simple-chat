import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
// import * as WebSocket from 'ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors(); // protection
  console.log(process.env.PORT);

  await app.listen(process.env.PORT || '80');
}
bootstrap();
