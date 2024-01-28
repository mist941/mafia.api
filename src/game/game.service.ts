import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GamePeriods } from './game.types';
import { User } from '../users/user.entity';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {

  }

  async createGame(createGameInput: CreateGameRequestDTO, user: User): Promise<Game> {
    try {
      return await this.prisma.game.create({
        data: {
          name: createGameInput.gameName,
          numberOfPlayers: createGameInput.numberOfPlayers,
          private: createGameInput.private,
          currentPeriod: GamePeriods.START,
          ownerId: user.id,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
