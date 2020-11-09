import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://root:qgTktFbYzZjmrfH4@cluster0.erppw.mongodb.net/simple-chat?retryWrites=true&w=majority',
      ),
  },
];
