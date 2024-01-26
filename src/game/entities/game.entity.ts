import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GamePeriods } from '../game.types';

@ObjectType()
export class Game {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: GamePeriods;
}