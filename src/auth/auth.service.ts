import { Injectable } from '@nestjs/common';
import { SignupRequestDTO } from './dto/signup-request.dto';
import { SigninRequestDTO } from './dto/signin-request.dto';

@Injectable()
export class AuthService {
  constructor() {
  }
  signup(signupInput: SignupRequestDTO) {
    return 'This action adds a new auth';
  }

  signin(signinInput: SigninRequestDTO) {
    return 'This action adds a new auth';
  }
}
