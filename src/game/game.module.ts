import { Module } from '@nestjs/common';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TokenModule
  ],
  providers: [
    GameResolver,
    GameService,
  ],
})
export class GameModule {
}
