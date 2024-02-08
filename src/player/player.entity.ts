import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Game } from '../game/game.entity';

@ObjectType()
export class PLayer {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  userId: number;

  @Field(() => String)
  status: string;

  @Field(() => String)
  role: string;

  @Field(() => Game)
  gameId: number;
}