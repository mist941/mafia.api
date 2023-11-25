import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async create(createUserInput: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await argon.hash(createUserInput.password);

      return await this.prisma.user.create({
        data: {
          email: createUserInput.email,
          username: createUserInput.username,
          hashedPassword,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      const hashedRefreshToken = await argon.hash(refreshToken);
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
