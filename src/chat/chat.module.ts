import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../users/user.module';
import { GameResolver } from '../game/game.resolver';
import { GameService } from '../game/game.service';

@Module({
  imports: [
    TokenModule,
    UserModule
  ],
  providers: [
    GameResolver,
    GameService,
  ],
})
export class ChatModule {
}
