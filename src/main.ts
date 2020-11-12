import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as WebSocket from 'ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // protection
  console.log(process.env.PORT);

  await app.listen(process.env.PORT || '80');

  // const WebSocketServer = ws;

  // подключённые клиенты
  const clients = {};

  // WebSocket-сервер на порту 8081
  const webSocketServer = new WebSocket.Server({
    port: 8081,
  });
  webSocketServer.on('connection', function (ws) {
    const id = Math.random();
    clients[id] = ws;
    console.log('новое соединение ' + id);

    ws.on('message', function (message) {
      console.log('получено сообщение ' + message);

      for (const key in clients) {
        setInterval(() => {
          clients[key].send(`${message}`);
        }, 1000);
      }
    });

    ws.on('close', function () {
      console.log('соединение закрыто ' + id);
      delete clients[id];
    });
  });
}
bootstrap();
