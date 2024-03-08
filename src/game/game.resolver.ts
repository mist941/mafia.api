import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { GameService } from './game.service';
import { ClassSerializerInterceptor, InternalServerErrorException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { GameResponseDTO } from './dto/geme-response.dto';
import { User } from '../users/user.entity';
import { InvitePlayersRequestDTO } from './dto/invite-players-request.dto';
import { InvitePlayersResponseDTO } from './dto/invite-players-response.dto';
import { PubSub } from 'graphql-subscriptions';
import { Id } from '../common.types';

const pubSub = new PubSub();

@Resolver()
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
  ) {

  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Mutation(() => GameResponseDTO)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameRequestDTO,
    @Context() context: { req: Request },
  ): Promise<GameResponseDTO> {
    const user = context.req['user'] as User;
    return this.gameService.createGame(createGameInput, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => InvitePlayersResponseDTO)
  async invitePlayers(
    @Args('invitePlayersInput') invitePlayersInput: InvitePlayersRequestDTO,
  ): Promise<InvitePlayersResponseDTO> {
    try {
      pubSub.publish(
        'invitePlayers',
        invitePlayersInput,
      );
      return invitePlayersInput;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Subscription(() => InvitePlayersResponseDTO, {
    nullable: true,
    resolve: (value) => value,
    filter: (payload, variables) => {
      return payload.userIds.includes(String(variables.userId));
    },
  })
  invitePlayersSubscription(
    @Args('userId') userId: Id,
  ) {
    try {
      return pubSub.asyncIterator('invitePlayers');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}