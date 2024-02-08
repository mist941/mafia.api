import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Id } from '../common.types';
import { PlayerRoles, PlayerStatuses } from './player.type';
import { PLayer } from './player.entity';

@Injectable()
export class PlayerService {
  readonly DEFAULT_PLAYER_STATUS: PlayerStatuses = PlayerStatuses.ACTIVE;

  constructor(private prisma: PrismaService) {

  }

  async createPlayer(gameId: Id, userId: Id, allowedRoles: PlayerRoles[]): Promise<PLayer> {
    try {
      const randomRoleIndex = Math.floor(Math.random() * (allowedRoles.length + 1));

      return this.prisma.player.create({
        data: {
          userId,
          gameId,
          status: this.DEFAULT_PLAYER_STATUS,
          role: allowedRoles[randomRoleIndex],
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}