import { Injectable } from '@nestjs/common';
import { SignupRequestDTO } from './dto/signup-request.dto';
import { SigninRequestDTO } from './dto/signin-request.dto';
import { UsersService } from '../users/users.service';
import { SignResponseDTO } from './dto/sign-response.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {

  }

  signup(signupInput: SignupRequestDTO): SignResponseDTO {
    return {
      accessToken: 'dasdsa',
      refreshToken: 'dasda',
      user: {
        id: 5,
        email: 'dsdsa@gmail.com',
        hashedPassword: 'sdada',
        username: 'sdasa',
      },
    };
  }

  signin(signinInput: SigninRequestDTO) {
    return 'This action adds a new auth';
  }
}
