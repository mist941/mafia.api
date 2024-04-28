import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { Id } from '../common.types';
import { ReadyToPlayRequestDTO } from './dto/ready-to-play-request.dto';

@Injectable()
export class GameService {
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
          currentPeriod: GamePeriods.START,
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
    const game: Game = await this.findGameById(createGameInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const gamePlayers: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(createGameInput.gameId);

    if (gamePlayers.length >= game.numberOfPlayers) {
      throw new ConflictException('Game is full');
    }

    if (gamePlayers.some(player => player.userId === user.id)) {
      throw new ConflictException('User already added to this game');
    }

    const usedRoles: PlayerRoles[] = gamePlayers.map(player => player.role) as PlayerRoles[];
    const availableRoles: PlayerRoles[] = this.getAvailableForCurrentGameRoles(
      usedRoles,
      this.ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers],
    );

    try {
      const newPlayer: PlayerResponseDTO = await this.playerService.createPlayer(
        createGameInput.gameId,
        user.id,
        availableRoles,
      );

      return { game, players: [...gamePlayers, newPlayer], player: newPlayer };
    } catch (e) {
      throw e;
    }
  }

  async readyToPlay(readyToPlayInput: ReadyToPlayRequestDTO): Promise<GameResponseDTO> {
    const game: Game = await this.findGameById(readyToPlayInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    try {
      const player: PlayerResponseDTO = await this.playerService.readyToPlay(readyToPlayInput.playerId);
      const players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(readyToPlayInput.gameId);

      return { game, players, player };
    } catch (e) {
      throw e;
    }
  }

  async findGameById(id: Id): Promise<Game> {
    try {
      return await this.prisma.game.findFirst({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  getAvailableForCurrentGameRoles(usedRoles: PlayerRoles[], rolesByNumberOfPlayers: PlayerRoles[]): PlayerRoles[] {
    let result: PlayerRoles[] = [];
    let actualUsedRoles: PlayerRoles[] = usedRoles;

    rolesByNumberOfPlayers.forEach(role => {
      if (actualUsedRoles.includes(role)) {
        const firstFound = actualUsedRoles.findIndex(usedRole => usedRole === role);
        actualUsedRoles.splice(firstFound, 1);
      } else {
        result.push(role);
      }
    });

    return result;
  }
}
