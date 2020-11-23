import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { buildMessage } from './chat.utils';

@Catch(Error, WsException)
export class WebsocketsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    super.catch(exception, host);

    host
      .switchToWs()
      .getClient()
      .send(
        JSON.stringify(
          buildMessage('exception', {
            name: exception.name,
            message: exception.message,
          }),
        ),
      );
  }
}
