import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDTO } from './dto/create-token.dto';
import { TokensResponseDTO } from './dto/tokens-response.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  generateTokens(createTokenInput: CreateTokenDTO): TokensResponseDTO {
    try {
      const accessToken = this.jwtService.sign(createTokenInput, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '10h',
      });
      const refreshToken = this.jwtService.sign(createTokenInput, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '5d',
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