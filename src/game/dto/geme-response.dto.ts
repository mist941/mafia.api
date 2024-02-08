import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.entity';
import { PLayer } from '../../player/player.entity';
import { Game } from '../game.entity';

@ObjectType()
export class GameResponseDTO {
  @Field(() => Game)
  game: Game;

  @Field(() => User)
  owner: User;

  @Field(() => PLayer)
  players: PLayer[];
}
