import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Id } from '../common.types';
import { PlayerRoles, PlayerStatuses } from './player.types';
import { PlayerResponseDTO } from './dto/player-response.dto';

@Injectable()
export class PlayerService {
  readonly DEFAULT_PLAYER_STATUS: PlayerStatuses = PlayerStatuses.ACTIVE;
  readonly DEFAULT_PLAYER_DB_SELECTION = {
    id: true,
    role: true,
    status: true,
    userId: true,
    ready: true,
    user: {
      select: {
        username: true,
      },
    },
  }

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

      return {
        id: player.id,
        role: player.role,
        status: player.status,
        userId: player.userId,
        ready: player.ready,
        username: player.user.username,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getPlayersByGameId(gameId: Id): Promise<PlayerResponseDTO[]> {
    try {
      const players = await this.prisma.player.findMany({
        where: { gameId },
        select: this.DEFAULT_PLAYER_DB_SELECTION,
      });

      return players.map(player => ({
        id: player.id,
        role: player.role,
        status: player.status,
        userId: player.userId,
        ready: player.ready,
        username: player.user.username,
      }));
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}