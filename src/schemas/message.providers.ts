import { Connection } from 'mongoose';
import { MessageSchema } from './message.schema';

export const messagesProviders = [
  {
    provide: 'MESSAGE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Message', MessageSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
