import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TokenModule,
  ],
  providers: [
    UserService,
    UserResolver
  ],
  exports: [
    UserService
  ]
})
export class UserModule {
}
