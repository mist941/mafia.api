import { Injectable } from '@nestjs/common';
import { CreateGameRequestDTO } from './dto/create-game-request.dto';

@Injectable()
export class GameService {
  constructor() {

  }

  async createGame(createGameInput: CreateGameRequestDTO) {

  }
}
