import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtSocketAuthGuard } from '../auth/jwt-socket-auth.guard';
import { UserService } from '../auth/user.service';
import { Server } from 'ws';
import { ChatService } from './chat.service';
import { buildChatMessage, buildChatSystemMessage } from './chat.utils';
import { WebsocketsExceptionFilter } from './websockets-exception.filter';
import { MessageService } from './message.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  activeChatClients = {};

  handleConnection() {
    console.log('Connected');
  }

  handleDisconnect(client) {
    for (const key in this.activeChatClients) {
      const chat = this.activeChatClients[key];

      const activeConnectionIndex = chat.indexOf(client);

      if (activeConnectionIndex !== -1) {
        chat.splice(activeConnectionIndex, 1);

        console.log(`Client ${activeConnectionIndex} disconnected`);
      }
    }
  }

  // private broadcast(event, message: any) {
  //   const broadCastMessage = buildMessage(event, message);
  //   for (let c of this.wsClients) {
  //     c.send(broadCastMessage);
  //   }
  // }

  // @SubscribeMessage('messages')
  // saveMessage(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'messages', data: item })),
  //   );
  // }

  @UseGuards(JwtSocketAuthGuard)
  @SubscribeMessage('enter')
  @UseFilters(new WebsocketsExceptionFilter())
  async enter(
    @MessageBody() data: { connectId: string; token: string },
    @ConnectedSocket() client,
  ): Promise<any> {
    if (!data.connectId) {
      throw new WsException('ConnectId is required');
    }

    const chat = await this.chatService.getByConnectId(data.connectId);

    if (!chat) {
      throw new WsException(`Chat with connectId ${data.connectId} not found`);
    }

    if (!this.activeChatClients[data.connectId]) {
      this.activeChatClients[data.connectId] = [];
    }

    this.activeChatClients[data.connectId].push(client);

    return buildChatSystemMessage(`User entered`);
  }

  @UseGuards(JwtSocketAuthGuard)
  @SubscribeMessage('message')
  @UseFilters(new WebsocketsExceptionFilter())
  async chatMessage(
    @MessageBody() data: { connectId: string; message: string; token: string },
  ): Promise<any> {
    if (!data.connectId) {
      throw new WsException('ConnectId is required');
    }

    const userFromToken: any = this.jwtService.decode(data.token);

    const user = await this.userService.get(userFromToken.sub);

    const chat = await this.chatService.getByConnectId(data.connectId);

    if (!chat) {
      throw new WsException(`Chat with connectId ${data.connectId} not found`);
    }

    await this.messageService.create(user._id, data.message, chat._id);

    if (!this.activeChatClients[data.connectId]) {
      throw new WsException(
        `Please enter in chat please, chat don't have active clients`,
      );
    }

    this.activeChatClients[data.connectId].forEach((client) => {
      client.send(JSON.stringify(buildChatMessage(user, data.message)));
    });

    return;
  }
}
