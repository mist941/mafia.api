import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Id } from '../common.types';
import { PlayerRoles, PlayerStatuses } from './player.types';
import { PlayerResponseDTO } from './dto/player-response.dto';
import { Player } from './player.entity';

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

  async updatePlayer(id: Id, params: Partial<Player>): Promise<PlayerResponseDTO> {
    try {
      const player: Player = await this.prisma.player.update({
        where: { id },
        data: {
          madeAction: params.madeAction,
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