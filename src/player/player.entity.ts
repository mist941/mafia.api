import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { PlayerRoles, PlayerStatuses } from './player.type';
import { Game } from '../game/game.entity';

@ObjectType()
export class PLayer {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => String)
  status: PlayerStatuses;

  @Field(() => String)
  role: PlayerRoles;

  @Field(() => Game)
  game: Game;
}