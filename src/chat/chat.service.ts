import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/user.entity';
import { CreateMessageRequestDTO } from './dto/create-message-request.dto';
import { Message } from './message.entity';

@Injectable()
export class ChatService {

  constructor(
    private prisma: PrismaService,
  ) {

  }

  async createMessage(createMessageInput: CreateMessageRequestDTO, user: User): Promise<Message> {
    try {
      return this.prisma.message.create({
        data: {
          userId: user.id,
          gameId: createMessageInput.gameId,
          text: createMessageInput.text,
        },
        select: {
          id: true,
          user: true,
          game: true,
          createdAt: true,
          text: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
