import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Inject,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MyLogger } from './logger/my-logger.service';
import { RedisClient } from 'redis';
import { RedisModule } from './redis/redis.module';
import { REDIS } from './redis/redis.constants';
import { AuthModule } from './auth/auth.module';
import * as session from 'express-session';
import * as RedisStore from 'connect-redis';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? '.env.test'
          : process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      timezone: '+09:00',
      synchronize: true,
      autoLoadEntities: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
      { dbName: process.env.MONGO_DATABASE },
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/static',
      serveStaticOptions: {
        extensions: ['html'],
        index: false,
      },
    }),
    UsersModule,
    BoardsModule,
    CommentsModule,
    RedisModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({ client: this.redis }),
          name: 'whale',
          secret: 'An0+n4lh2Ag1tEAs9ad1',
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 1000 * 60 * 60 * 3,
            httpOnly: true,
            sameSite: 'strict',
          },
        }),
        LoggerMiddleware,
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
