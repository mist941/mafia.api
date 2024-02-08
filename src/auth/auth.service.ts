import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupRequestDTO } from './dto/signup-request.dto';
import { SigninRequestDTO } from './dto/signin-request.dto';
import { UsersService } from '../users/users.service';
import { SignResponseDTO } from './dto/sign-response.dto';
import { TokenService } from '../token/token.service';
import { User } from '../users/user.entity';
import { TokensResponseDTO } from '../token/dto/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {

  }

  async signup(signupInput: SignupRequestDTO): Promise<SignResponseDTO> {
    const existedUser: User = await this.userService.findUserByEmail(signupInput.email);

    if (existedUser) {
      throw new ConflictException('This user already exist!');
    }

    const newUser: User = await this.userService.create(signupInput);
    const tokens: TokensResponseDTO = this.tokenService.generateTokens({
      email: signupInput.email,
      password: signupInput.password,
    });

    await this.userService.updateRefreshToken(newUser.id, tokens.refreshToken);

    return { ...tokens, user: newUser };
  }

  async signin(signinInput: SigninRequestDTO): Promise<SignResponseDTO> {
    const user: User = await this.userService.validateUser(signinInput);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens: TokensResponseDTO = this.tokenService.generateTokens({
      email: signinInput.email,
      password: signinInput.password,
    });

    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user };
  }
}
