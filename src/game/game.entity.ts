import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.entity';

@ObjectType()
export class Game {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => User)
  ownerId: number;

  @Field()
  createdAt?: Date;

  @Field(() => Int)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: string;

  @Field(() => String)
  currentRole?: string;

  @Field(() => Boolean)
  private: Boolean;
}