import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GamePeriods } from './game.types';
import { User } from '../users/user.entity';
import { GameResponseDTO } from './dto/geme-response.dto';
import { PlayerRoles } from '../player/player.types';
import { PlayerService } from '../player/player.service';
import { Game } from './game.entity';
import { PlayerResponseDTO } from '../player/dto/player-response.dto';
import { AddNewPlayerRequestDTO } from './dto/add-new-player-request.dto';
import { PubSub } from 'graphql-subscriptions';
import { Id } from '../common.types';

const pubSub = new PubSub();

@Injectable()
export class GameService {
  readonly DEFAULT_GAME_PERIOD: GamePeriods = GamePeriods.START;
  readonly ROLES_BY_NUMBER_OF_PLAYERS: { [key: number]: PlayerRoles[] } = {
    5: [
      PlayerRoles.PEACEFUL_RESIDENT,
      PlayerRoles.PEACEFUL_RESIDENT,
      PlayerRoles.PEACEFUL_RESIDENT,
      PlayerRoles.MAFIA,
      PlayerRoles.DOCTOR,
    ],
  };

  constructor(
    private prisma: PrismaService,
    private playerService: PlayerService,
  ) {

  }

  async createGame(createGameInput: CreateGameRequestDTO, user: User): Promise<GameResponseDTO> {
    try {
      const game: Game = await this.prisma.game.create({
        data: {
          name: createGameInput.gameName,
          numberOfPlayers: createGameInput.numberOfPlayers,
          private: createGameInput.private,
          currentPeriod: this.DEFAULT_GAME_PERIOD,
          ownerId: user.id,
        },
      });

      const firstPlayer: PlayerResponseDTO = await this.playerService.createPlayer(
        game.id,
        user.id,
        this.ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers],
      );

      return { game, players: [firstPlayer], player: firstPlayer };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addNewPlayer(createGameInput: AddNewPlayerRequestDTO, user: User): Promise<GameResponseDTO> {
    const game = await this.findGameById(createGameInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    try {
      const newPlayer: PlayerResponseDTO = await this.playerService.createPlayer(
        createGameInput.gameId,
        user.id,
        this.ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers],
      );

      const gamePlayers: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(createGameInput.gameId);

      const preparedGameResponse: GameResponseDTO = { game, players: gamePlayers, player: newPlayer };

      this.syncGame(preparedGameResponse);

      return preparedGameResponse;
    } catch (e) {
      throw e;
    }
  }

  syncGame(game: GameResponseDTO) {
    pubSub.publish('syncGame', game);
  }

  async findGameById(gameId: Id): Promise<Game> {
    try {
      return await this.prisma.game.findFirst({
        where: { id: gameId },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
