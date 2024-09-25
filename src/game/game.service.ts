import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GamePeriods } from './game.types';
import { User } from '../users/user.entity';
import { GameResponseDTO } from './dto/geme-response.dto';
import { PlayerRoles, PlayerStatuses } from '../player/player.types';
import { PlayerService } from '../player/player.service';
import { PlayerResponseDTO } from '../player/dto/player-response.dto';
import { AddNewPlayerRequestDTO } from './dto/add-new-player-request.dto';
import { Id } from '../common.types';
import { ReadyToPlayRequestDTO } from './dto/ready-to-play-request.dto';
import { LAST_ROLE_BY_NUMBER_OF_PLAYERS, ORDER_OF_PLAY, ROLES_BY_NUMBER_OF_PLAYERS } from './game.constants';
import { CreateActionRequestDTO } from './dto/create-action-request.dto';
import { ActionService } from '../action/action.service';
import { GetGameDataRequestDTO } from './dto/get-game-data-request.dto';
import { Action, Game } from '@prisma/client';

/**
 * Service class for managing game-related operations.
 */
@Injectable()
export class GameService {

  constructor(
    private prisma: PrismaService,
    private playerService: PlayerService,
    private actionService: ActionService,
  ) {

  }

  async getGameData(getGameDataInput: GetGameDataRequestDTO): Promise<GameResponseDTO> {
    const game: Game = await this.findGameById(getGameDataInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(getGameDataInput.gameId);
    const player: PlayerResponseDTO = await this.playerService.getPlayerById(getGameDataInput.playerId);

    return { game, players, player };
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
        ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers],
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

    try {
      const usedRoles: PlayerRoles[] = gamePlayers.map(player => player.role) as PlayerRoles[];
      const availableRoles: PlayerRoles[] = this.getAvailableForCurrentGameRoles(
        usedRoles,
        ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers],
      );

      const newPlayer: PlayerResponseDTO = await this.playerService.createPlayer(
        createGameInput.gameId,
        user.id,
        availableRoles,
      );

      return { game, players: [...gamePlayers, newPlayer], player: newPlayer };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async readyToPlay(readyToPlayInput: ReadyToPlayRequestDTO): Promise<GameResponseDTO> {
    let game: Game = await this.findGameById(readyToPlayInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    try {
      const player: PlayerResponseDTO = await this.playerService.readyToPlay(readyToPlayInput.playerId);
      const players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(readyToPlayInput.gameId);

      if (
        players
          .filter(player => player.status === PlayerStatuses.ACTIVE)
          .every(player => player.ready)
      ) {
        game = await this.updateGame(game.id, {
          currentPeriod: GamePeriods.NIGHT,
          currentRole: this.getNextRoleToPlay(game),
          step: game.step + 1,
        });
      }

      return { game, players, player };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createAction(createActionInput: CreateActionRequestDTO): Promise<GameResponseDTO> {
    try {
      await this.actionService.createAction(createActionInput);
      return this.updateGameAfterAnActin(createActionInput.gameId, createActionInput.playerId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateGameAfterAnActin(gameId: Id, playerId: Id): Promise<GameResponseDTO> {
    try {
      let game: Game = await this.findGameById(gameId);
      let players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(gameId);
      const isReadyForNight = players
        .filter(player => player.id !== playerId)
        .every(player => player.madeAction);

      const isReadyForDay = LAST_ROLE_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers] === game.currentRole;

      if (game.currentPeriod === GamePeriods.DAY && isReadyForNight) {
        await this.calculatePeriodResults(game);
        return this.goToNight(game, playerId);
      }
      if (game.currentPeriod === GamePeriods.NIGHT && isReadyForDay) {
        await this.calculatePeriodResults(game);
        return this.goToDay(game, playerId);
      }
      if (game.currentPeriod === GamePeriods.DAY) {
        return this.vote(game, playerId);
      }

      return this.goToNextRole(game, playerId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async goToDay(game: Game, playerId: Id): Promise<GameResponseDTO> {
    const player = await this.playerService.updatePlayer(playerId, { madeAction: false });
    const players = await this.playerService.setAllPlayersActionStatusAsFalse(game.id);
    const updatedGame = await this.updateGame(game.id, {
      currentPeriod: GamePeriods.DAY,
      step: game.step + 1,
      currentRole: null,
    });

    return { game: updatedGame, players, player };
  }

  async goToNight(game: Game, playerId: Id): Promise<GameResponseDTO> {
    const nextRole = this.getNextRoleToPlay(game);
    const player = await this.playerService.updatePlayer(playerId, { madeAction: false });
    const players = await this.playerService.setAllPlayersActionStatusAsFalse(game.id);
    const updatedGame = await this.updateGame(game.id, {
      currentPeriod: GamePeriods.NIGHT,
      step: game.step + 1,
      currentRole: nextRole,
    });

    return { game: updatedGame, players, player };
  }

  async goToNextRole(game: Game, playerId: Id): Promise<GameResponseDTO> {
    const nextRole = this.getNextRoleToPlay(game);
    const player = await this.playerService.updatePlayer(playerId, { madeAction: true });
    const players = await this.playerService.getPlayersByGameId(game.id);
    const updatedGame = await this.updateGame(game.id, { currentRole: nextRole });
    return { game: updatedGame, players, player };
  }

  async vote(game: Game, playerId: Id): Promise<GameResponseDTO> {
    const player = await this.playerService.updatePlayer(playerId, { madeAction: true });
    const players = await this.playerService.getPlayersByGameId(game.id);
    return { game, players, player };
  }

  async calculatePeriodResults(game: Game): Promise<void> {
    const actions: Action[] = await this.actionService.getActionsByGameIdAndStep(game);

    if (game.currentPeriod === GamePeriods.DAY) {
      await this.killPlayerByVote(actions);
    }
    if (game.currentPeriod === GamePeriods.NIGHT) {

    }
  }

  async killPlayerByVote(actions: Action[]): Promise<void> {
    const playerIdToKill = this.playerService.findPlayerIdToKillByVote(actions);
    if (playerIdToKill) {
      await this.playerService.updatePlayer(playerIdToKill, { status: PlayerStatuses.KILLED });
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

  async updateGame(id: Id, params: Partial<Game>): Promise<Game> {
    try {
      return await this.prisma.game.update({
        where: { id },
        data: {
          currentPeriod: params.currentPeriod,
          currentRole: params.currentRole,
          step: params.step,
        },
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

  getNextRoleToPlay(game: Game): PlayerRoles | undefined {
    const rolesByNumberOfPlayers: PlayerRoles[] = ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers];
    let preparedOrderOfPlay: PlayerRoles[] = ORDER_OF_PLAY;

    if (game.currentRole) {
      const currentRoleIndex = ORDER_OF_PLAY.findIndex(role => role === game.currentRole);
      preparedOrderOfPlay = ORDER_OF_PLAY.slice(currentRoleIndex + 1);
    }

    return preparedOrderOfPlay.find(role => rolesByNumberOfPlayers.includes(role));
  }
}
