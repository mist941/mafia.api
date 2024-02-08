import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { PlayerRoles, PlayerStatuses } from './player.type';
import { Game } from '../game/game.entity';

@ObjectType()
export class PLayer {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  userId: number;

  @Field(() => PlayerStatuses)
  status: string;

  @Field(() => PlayerStatuses)
  role: string;

  @Field(() => Game)
  gameId: number;
}