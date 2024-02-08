import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GameService } from './game.service';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Mutation(() => GameResponseDTO)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameRequestDTO,
    @Context() context: { req: Request },
  ): Promise<GameResponseDTO> {
    const user = context.req['user'] as User;
    return this.gameService.createGame(createGameInput, user);
  }
}