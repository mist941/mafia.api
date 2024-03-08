import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    GameModule,
    PlayerModule,
  ],
  controllers: [],
  providers: [
    { provide: 'PUB_SUB', useValue: pubSub },
    AppResolver,
  ],
})
export class AppModule {
}
