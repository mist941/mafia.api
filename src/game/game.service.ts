import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GamePeriods } from './game.types';
import { User } from '../users/user.entity';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {

  }

  async createGame(createGameInput: CreateGameRequestDTO, user: User) {
    try {
      return await this.prisma.game.create({
        data: {
          name: createGameInput.gameName,
          numberOfPlayers: createGameInput.numberOfPlayers,
          private: createGameInput.private,
          currentPeriod: GamePeriods.START,
          ownerId: user.id,
          currentPlayerId: null,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
