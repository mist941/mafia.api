import { Module } from '@nestjs/common';
import { JwtModule as JwtM } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [JwtM.register({})],
  providers: [TokenService],
  exports: [TokenService],
})

export class TokenModule {
}