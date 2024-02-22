import { Args, Query, Resolver } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GameResponseDTO } from '../game/dto/geme-response.dto';
import { SearchUsersRequestDTO } from './dto/search-users-request.dto';
import { SearchUsersResponseDTO } from './dto/search-users-response.dto';

@Resolver()
export class UserResolver {
  constructor(

  ) {
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Query(() => GameResponseDTO)
  async createGame(
    @Args('searchUsersInput') searchUsersInput: SearchUsersRequestDTO,
  ): Promise<SearchUsersResponseDTO[]> {
    return [];
  }
}