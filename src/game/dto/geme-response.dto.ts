import { Field, ObjectType } from '@nestjs/graphql';
import { Game } from '../game.entity';
import { PlayerResponseDTO } from '../../player/dto/player-response.dto';

@ObjectType()
export class GameResponseDTO {
  @Field(() => Game)
  game: Game;

  @Field(() => [PlayerResponseDTO])
  players: PlayerResponseDTO[];

  @Field(() => PlayerResponseDTO)
  player: PlayerResponseDTO;
}
