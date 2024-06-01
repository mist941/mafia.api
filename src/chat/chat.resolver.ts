import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../users/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { CreateMessageRequestDTO } from './dto/create-message-request.dto';
import { ChatService } from './chat.service';
import { MessageResponseDTO } from './dto/message-response.dto';


const pubSub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
  ) {

  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Mutation(() => MessageResponseDTO)
  async createGame(
    @Args('createMessageInput') createMessageInput: CreateMessageRequestDTO,
    @Context() context: { req: Request },
  ): Promise<MessageResponseDTO> {
    const user = context.req['user'] as User;
    return this.chatService.createMessage(createMessageInput, user);
  }
}