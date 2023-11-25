import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDTO } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  generateTokens(params: CreateTokenDTO) {
    try {
      const accessToken = this.jwtService.sign(params, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15000s',
      });
      const refreshToken = this.jwtService.sign(params, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '30000s',
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}