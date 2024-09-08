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
import { ORDER_OF_PLAY, ROLES_BY_NUMBER_OF_PLAYERS } from './game.constants';
import { CreateActionRequestDTO } from './dto/create-action-request.dto';
import { ActionService } from '../action/action.service';

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

  /**
   * Creates a new game.
   *
   * @param {CreateGameRequestDTO} createGameInput - The input data for creating the game.
   * @param {User} user - The user creating the game.
   * @returns {Promise<GameResponseDTO>} A promise that resolves to the newly created game response.
   * @throws {InternalServerErrorException} If an error occurs while creating the game.
   */
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

  /**
   * Adds a new player to a game.
   *
   * @param {AddNewPlayerRequestDTO} createGameInput - The input data for creating a new player.
   * @param {User} user - The user to be added to the game.
   * @returns {Promise<GameResponseDTO>} - A promise that resolves to the updated game response.
   * @throws {NotFoundException} - If the game is not found.
   * @throws {ConflictException} - If the game is full or the user is already added to the game.
   */
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

  /**
   * Marks a player as ready to play in a game and returns game information and player status.
   *
   * @param {ReadyToPlayRequestDTO} readyToPlayInput - The input data containing the game ID and player ID.
   * @returns {Promise<GameResponseDTO>} - The game information and player status.
   * @throws {NotFoundException} - If the game is not found.
   */
  async readyToPlay(readyToPlayInput: ReadyToPlayRequestDTO): Promise<GameResponseDTO> {
    let game: Game = await this.findGameById(readyToPlayInput.gameId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    try {
      const player: PlayerResponseDTO = await this.playerService.readyToPlay(readyToPlayInput.playerId);
      const players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(readyToPlayInput.gameId);

      if (players.every(player => player.ready)) {
        game = await this.updateGame(game.id, {
          currentPeriod: GamePeriods.NIGHT,
          currentRole: this.getNextRoleToPlay(game),
          step: 1,
        });
      }

      return { game, players, player };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Creates a new action based on the input provided and updates the game state.
   *
   * @param {CreateActionRequestDTO} createActionInput - The input data required to create a new action.
   * @return {Promise<GameResponseDTO>} - A promise that resolves to the updated game state after the action.
   * @throws {InternalServerErrorException} - Throws an exception if the action creation or game update fails.
   */
  async createAction(createActionInput: CreateActionRequestDTO): Promise<GameResponseDTO> {
    try {
      await this.actionService.createAction(createActionInput);
      return this.updateGameAfterAnActin(createActionInput.gameId, createActionInput.playerId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Updates the game state after a player has taken an action.
   * This method retrieves the current game and player information,
   * determines the next role to play, and updates the game period if necessary.
   *
   * @param {Id} gameId - The unique identifier of the game to be updated.
   * @param {Id} playerId - The unique identifier of the player who has just taken an action.
   * @return {Promise<GameResponseDTO>} - A promise that resolves to the updated game state, including the list of players and the current player information.
   * @throws {InternalServerErrorException} - If an error occurs while updating the game.
   */
  async updateGameAfterAnActin(gameId: Id, playerId: Id): Promise<GameResponseDTO> {
    try {
      let game: Game = await this.findGameById(gameId);
      const player: PlayerResponseDTO = await this.playerService.updatePlayer(playerId, { madeAction: true });
      let players: PlayerResponseDTO[] = await this.playerService.getPlayersByGameId(gameId);

      const nextRole = this.getNextRoleToPlay(game);
      if (!nextRole) {
        players = await this.playerService.setAllPlayersActionStatusAsFalse(gameId);
        game = await this.updateGame(gameId, {
          currentPeriod: GamePeriods.DAY,
          step: game.step + 1,
        });
      }
      if (nextRole) {
        game = await this.updateGame(gameId, {
          currentPeriod: GamePeriods.NIGHT,
          currentRole: nextRole,
        });
      }

      return { game, players, player };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Finds a game by its ID.
   *
   * @param {Id} id - The ID of the game.
   * @returns {Promise<Game>} A promise that resolves with the found game.
   * @throws {InternalServerErrorException} If an error occurs while retrieving the game.
   */
  async findGameById(id: Id): Promise<Game> {
    try {
      return await this.prisma.game.findFirst({
        where: { id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Updates the specified game with the provided parameters.
   *
   * @param {Id} id - The unique identifier of the game to be updated.
   * @param {Partial<Game>} params - The game parameters to be updated.
   * @return {Promise<Game>} - The updated game object.
   * @throws {InternalServerErrorException} - If an error occurs during the update process.
   */
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

  /**
   * Returns the available player roles for the current game.
   *
   * @param {PlayerRoles[]} usedRoles - The roles currently being used in the game.
   * @param {PlayerRoles[]} rolesByNumberOfPlayers - The roles available for the current number of players.
   * @return {PlayerRoles[]} - The available player roles for the current game.
   */
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

  /**
   * Return the next role to play in the game.
   *
   * @param {Game} game - The current game object.
   * @return {PlayerRoles | undefined} - The next role to play, or undefined if not found.
   */
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
