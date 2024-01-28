import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userService: UsersService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.validateAccessToken(token);
      request['user'] = await this.userService.findUserByEmail(payload.email);
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const bearerToken = request.headers['authorization'];
    const parts = bearerToken?.split(' ');
    if (parts?.length === 2 && parts[0] === 'Bearer') {
      return parts[1]?.replaceAll('"', "");
    } else {
      throw new UnauthorizedException('Invalid Bearer token format');
    }
  }
}