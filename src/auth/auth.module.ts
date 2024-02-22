import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../users/user.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    UserModule,
    TokenModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
  ],
})
export class AuthModule {
}
