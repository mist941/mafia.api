import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GamePeriods } from './game.types';
import { User } from '../users/user.entity';
import { GameResponseDTO } from './dto/geme-response.dto';
import { PlayerRoles } from '../player/player.type';
import { UsersService } from '../users/users.service';
import { PlayerService } from '../player/player.service';

@Injectable()
export class GameService {
  readonly DEFAULT_GAME_PERIOD: GamePeriods = GamePeriods.START;
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
      const game = await this.prisma.game.create({
        data: {
          name: createGameInput.gameName,
          numberOfPlayers: createGameInput.numberOfPlayers,
          private: createGameInput.private,
          currentPeriod: this.DEFAULT_GAME_PERIOD,
          ownerId: user.id,
        },
      });

      const firstPlayer = await this.playerService.createPlayer(
        game.id,
        user.id, 
        this.ROLES_BY_NUMBER_OF_PLAYERS[game.numberOfPlayers]
      );

      return game;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
