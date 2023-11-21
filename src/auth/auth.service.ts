import { Injectable } from '@nestjs/common';
import { SignupRequestDTO } from './dto/signup-request.dto';

@Injectable()
export class AuthService {
  signUp(signUpInput: SignupRequestDTO) {
    return 'This action adds a new auth';
  }
}
