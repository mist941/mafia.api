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
import { AddNewPlayerRequestDTO } from './dto/add-new-player-request.dto';
import { ReadyToPlayRequestDTO } from './dto/ready-to-play-request.dto';

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
  @UseInterceptors(ClassSerializerInterceptor)
  @Mutation(() => GameResponseDTO)
  async addNewPlayer(
    @Args('addNewPlayerInput') addNewPlayerInput: AddNewPlayerRequestDTO,
    @Context() context: { req: Request },
  ): Promise<GameResponseDTO> {
    try {
      const user = context.req['user'] as User;
      const game: GameResponseDTO = await this.gameService.addNewPlayer(addNewPlayerInput, user);

      pubSub.publish('syncGame', game);

      return game;
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Mutation(() => GameResponseDTO)
  async readyToPlay(
    @Args('readyToPlayInput') readyToPlayInput: ReadyToPlayRequestDTO,
  ): Promise<GameResponseDTO> {
    const game: GameResponseDTO = await this.gameService.readyToPlay(readyToPlayInput);

    try {
      pubSub.publish('syncGame', game);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return game;
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

  @Subscription(() => GameResponseDTO, {
    nullable: true,
    resolve: (value, { playerId }) => {
      const game: GameResponseDTO = value;
      game.player = game.players.find(player => player.id === playerId);
      return game;
    },
    filter: (payload, variables) => {
      return payload.game?.id === variables.gameId;
    },
  })
  syncGameSubscription(
    @Args('gameId') gameId: Id,
    @Args('playerId') playerId: Id,
  ) {
    try {
      return pubSub.asyncIterator('syncGame');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}