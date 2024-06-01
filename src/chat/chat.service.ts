import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/user.entity';
import { CreateMessageRequestDTO } from './dto/create-message-request.dto';
import { MessageResponseDTO } from './dto/message-response.dto';

@Injectable()
export class ChatService {

  constructor(
    private prisma: PrismaService,
  ) {

  }

  async createMessage(createMessageInput: CreateMessageRequestDTO, user: User): Promise<MessageResponseDTO> {
    try {
      const message = await this.prisma.message.create({
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

      return {
        id: message.id,
        user: message.user,
        game: message.game,
        text: message.text,
        createdAt: message.createdAt,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
