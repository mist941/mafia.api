import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Id } from '../common.types';
import { PlayerRoles, PlayerStatuses } from './player.types';
import { PlayerResponseDTO } from './dto/player-response.dto';
import { Player } from './player.entity';
import { Action } from '@prisma/client';
import { ActionTypes } from '../action/action.types';

@Injectable()
export class PlayerService {
  readonly DEFAULT_PLAYER_STATUS: PlayerStatuses = PlayerStatuses.ACTIVE;
  readonly DEFAULT_PLAYER_DB_SELECTION = {
    id: true,
    role: true,
    status: true,
    userId: true,
    ready: true,
    gameId: true,
    madeAction: true,
    user: {
      select: {
        username: true,
      },
    },
  };

  constructor(private prisma: PrismaService) {

  }

  async createPlayer(gameId: Id, userId: Id, allowedRoles: PlayerRoles[]): Promise<PlayerResponseDTO> {
    try {
      const randomRoleIndex = Math.floor(Math.random() * (allowedRoles.length + 1));
      const player = await this.prisma.player.create({
        data: {
          userId,
          gameId,
          status: this.DEFAULT_PLAYER_STATUS,
          role: allowedRoles[randomRoleIndex],
        },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return this.serializePlayer(player);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updatePlayerByActions(actions: Action[], player: PlayerResponseDTO): Promise<void> {
    try {
      const newPlayer: Partial<Player> = {};
      const isPlayerKilled = actions.some(action =>
        action.actionType === ActionTypes.KILL &&
        action.targetPlayerId === player.id,
      );
      const isPlayerHealed = actions.some(action =>
        action.actionType === ActionTypes.HILL &&
        action.targetPlayerId === player.id,
      );

      if (isPlayerKilled && !isPlayerHealed) {
        newPlayer.status = PlayerStatuses.KILLED;
      }

      await this.updatePlayer(player.id, newPlayer);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updatePlayer(id: Id, params: Partial<Player>): Promise<PlayerResponseDTO> {
    try {
      const player: Player = await this.prisma.player.update({
        where: { id },
        data: {
          madeAction: params.madeAction,
          status: params.status,
        },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return this.serializePlayer(player);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async setAllPlayersActionStatusAsFalse(gameId: Id): Promise<PlayerResponseDTO[]> {
    try {
      await this.prisma.player.updateMany({
        where: { gameId },
        data: {
          madeAction: false,
        },
      });

      return this.getPlayersByGameId(gameId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getPlayerById(id: Id): Promise<PlayerResponseDTO> {
    try {
      const player: Player = await this.prisma.player.findFirst({
        where: { id },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return this.serializePlayer(player);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getPlayersByGameId(gameId: Id): Promise<PlayerResponseDTO[]> {
    try {
      const players: Player[] = await this.prisma.player.findMany({
        where: { gameId },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return players.map(this.serializePlayer);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async readyToPlay(playerId: Id): Promise<PlayerResponseDTO> {
    try {
      const player: Player = await this.prisma.player.update({
        where: { id: playerId },
        data: { ready: true },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return this.serializePlayer(player);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findPlayerIdToKillByVote(actions: Action[]) {
    const candidatesForKill: Map<Id, number> = new Map();

    actions.forEach(action => {
      if (action.actionType === ActionTypes.VOTE) {
        const candidateId = action.targetPlayerId;
        const currentVotes = candidatesForKill.get(candidateId) || 0;
        candidatesForKill.set(candidateId, currentVotes + 1);
      }
    });

    let maxVotes = 0;
    candidatesForKill.forEach(votes => {
      if (votes > maxVotes) {
        maxVotes = votes;
      }
    });

    const candidatesWithMaxVotes = Array.from(candidatesForKill.entries())
      .filter(([_, votes]) => votes === maxVotes)
      .map(([id]) => id);

    if (candidatesWithMaxVotes.length > 1) return;

    return candidatesWithMaxVotes[0];
  }

  serializePlayer(player): PlayerResponseDTO {
    return {
      id: player.id,
      role: player.role,
      status: player.status,
      userId: player.userId,
      ready: player.ready,
      username: player.user.username,
      madeAction: player.madeAction,
    };
  }
}