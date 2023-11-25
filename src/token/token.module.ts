import { Module } from '@nestjs/common';
import { JwtModule as JwtM } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtM.register({}),
    ConfigModule.forRoot(),
  ],
  providers: [TokenService],
  exports: [TokenService],
})

export class TokenModule {
}