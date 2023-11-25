import { ConflictException, Injectable } from '@nestjs/common';
import { SignupRequestDTO } from './dto/signup-request.dto';
import { SigninRequestDTO } from './dto/signin-request.dto';
import { UsersService } from '../users/users.service';
import { SignResponseDTO } from './dto/sign-response.dto';
import { TokenService } from '../token/token.service';
import { User } from '../users/entities/user.entity';

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
    const tokens = this.tokenService.generateTokens({
      email: signupInput.email,
      password: signupInput.password,
    });

    await this.userService.updateRefreshToken(newUser.id, tokens.refreshToken);

    return { ...tokens, user: newUser };
  }

  signin(signinInput: SigninRequestDTO) {
    return 'This action adds a new auth';
  }
}
