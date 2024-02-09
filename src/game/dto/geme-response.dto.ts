import { Field, ObjectType } from '@nestjs/graphql';
import { PLayer } from '../../player/player.entity';
import { Game } from '../game.entity';

@ObjectType()
export class GameResponseDTO {
  @Field(() => Game)
  game: Game;

  @Field(() => [PLayer])
  players: PLayer[];

  @Field(() => PLayer)
  player: PLayer;
}
