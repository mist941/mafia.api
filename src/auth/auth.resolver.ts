import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupRequestDTO } from './dto/signup-request.dto';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => Auth)
  signUp(@Args('signUpInput') signUpInput: SignupRequestDTO) {
    return this.authService.signUp(signUpInput);
  }
}
