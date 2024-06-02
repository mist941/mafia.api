import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../users/user.module';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TokenModule,
    UserModule
  ],
  providers: [
    ChatResolver,
    ChatService,
  ],
})
export class ChatModule {
}
