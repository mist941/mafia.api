import { Module } from '@nestjs/common';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TokenModule,
    UsersModule
  ],
  providers: [
    GameResolver,
    GameService,
  ],
})
export class GameModule {
}
