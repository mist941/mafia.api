import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Id } from '../common.types';
import { PlayerRoles, PlayerStatuses } from './player.type';
import { PLayer } from './player.entity';
import { PlayerResponseDto } from './dto/player-response.dto';

@Injectable()
export class PlayerService {
  readonly DEFAULT_PLAYER_STATUS: PlayerStatuses = PlayerStatuses.ACTIVE;

  constructor(private prisma: PrismaService) {

  }

  async createPlayer(gameId: Id, userId: Id, allowedRoles: PlayerRoles[]): Promise<PlayerResponseDto> {
    try {
      const randomRoleIndex = Math.floor(Math.random() * (allowedRoles.length + 1));

      const player = await this.prisma.player.create({
        data: {
          userId,
          gameId,
          status: this.DEFAULT_PLAYER_STATUS,
          role: allowedRoles[randomRoleIndex],
        },
      });

      const user = await this.prisma.user.findFirst({
        where: { id: player.userId },
      });

      return {
        id: player.id,
        role: player.role,
        status: player.status,
        userId: player.userId,
        username: user.username,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}