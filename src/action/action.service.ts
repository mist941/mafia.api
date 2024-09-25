import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActionRequestDTO } from '../game/dto/create-action-request.dto';
import { Action, Game } from '@prisma/client';

@Injectable()
export class ActionService {

  constructor(private prisma: PrismaService) {

  }

  async createAction(createActionInput: CreateActionRequestDTO): Promise<void> {
    try {
      await this.prisma.action.create({
        data: {
          actionType: createActionInput.actionType,
          sourcePlayerId: createActionInput.playerId,
          targetPlayerId: createActionInput.targetPlayerId,
          gameId: createActionInput.gameId,
          period: createActionInput.period,
          step: createActionInput.step,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getActionsByGameIdAndStep(game: Game): Promise<Action[]> {
    try {
      return await this.prisma.action.findMany({
        where: { gameId: game.id, step: game.step },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}