import { Module } from '@nestjs/common';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TokenModule,
    UsersModule,
    PlayerModule
  ],
  providers: [
    GameResolver,
    GameService,
  ],
})
export class GameModule {
}
