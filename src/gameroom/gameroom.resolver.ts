import { Resolver } from '@nestjs/graphql';
import { GameRoomService } from './gameroom.service';

@Resolver()
export class GameRoomResolver {
  constructor(private readonly gameRoomService: GameRoomService) {
  }

}