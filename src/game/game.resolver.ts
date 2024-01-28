import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GameService } from './game.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Game } from './game.entity';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';
import { GameResponseDTO } from './dto/geme-response.dto';
import { User } from '../users/user.entity';

@Resolver()
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
  ) {
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Game)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameRequestDTO,
    @Context() context: { req: Request },
  ): Promise<GameResponseDTO> {
    const user = context.req['user'] as User;
    return this.gameService.createGame(createGameInput, user);
  }
}