import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { GameService } from './game.service';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { GameResponseDTO } from './dto/geme-response.dto';
import { User } from '../users/user.entity';
import { InvitePlayersRequestDTO } from './dto/invite-players-request.dto';
import { InvitePlayersResponseDTO } from './dto/invite-players-response.dto';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class GameResolver {
  public pubSub: PubSub;

  constructor(
    private readonly gameService: GameService,
  ) {
    this.pubSub = new PubSub();
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
    await this.pubSub.publish(
      `invitePlayers`,
      invitePlayersInput,
    );
    return invitePlayersInput;
  }

  @UseGuards(AuthGuard)
  @Subscription(() => InvitePlayersResponseDTO)
  invitePlayersSubscription() {
    return this.pubSub.asyncIterator(`invitePlayers`);
  }
}