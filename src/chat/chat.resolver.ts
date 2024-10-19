import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { ClassSerializerInterceptor, InternalServerErrorException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../users/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { CreateMessageRequestDTO } from './dto/create-message-request.dto';
import { ChatService } from './chat.service';
import { MessageResponseDTO } from './dto/message-response.dto';
import { Id } from '../common.types';


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
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageRequestDTO,
    @Context() context: { req: Request },
  ): Promise<MessageResponseDTO> {
    const user: User = context.req['user'] as User;
    const message: MessageResponseDTO = await this.chatService.createMessage(createMessageInput, user);

    try {
      pubSub.publish('syncMessages', message);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return message;
  }

  @Subscription(() => MessageResponseDTO, {
    nullable: true,
    resolve: (value) => value,
    filter: () => {
      return true;
    },
  })
  syncMessagesSubscription(
    @Args('gameId') gameId: Id,
  ) {
    try {
      return pubSub.asyncIterator('syncMessages');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}