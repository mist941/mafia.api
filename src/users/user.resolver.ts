import { Args, Query, Resolver } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SearchUsersRequestDTO } from './dto/search-users-request.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Query(() => [User])
  async searchUsers(
    @Args('searchUsersInput') searchUsersInput: SearchUsersRequestDTO,
  ): Promise<User[]> {
    return this.userService.searchUsers(searchUsersInput.query);
  }
}