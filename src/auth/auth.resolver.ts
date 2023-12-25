import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupRequestDTO } from './dto/signup-request.dto';
import { SignResponseDTO } from './dto/sign-response.dto';
import { SigninRequestDTO } from './dto/signin-request.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => SignResponseDTO)
  signup(@Args('signupInput') signupInput: SignupRequestDTO) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => SignResponseDTO)
  signin(@Args('signinInput') signinInput: SigninRequestDTO) {
    return this.authService.signin(signinInput);
  }
}
