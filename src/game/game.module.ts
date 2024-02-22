import { Module } from '@nestjs/common';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../users/user.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TokenModule,
    UserModule,
    PlayerModule
  ],
  providers: [
    GameResolver,
    GameService,
  ],
})
export class GameModule {
}
