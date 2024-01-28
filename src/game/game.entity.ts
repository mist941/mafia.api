import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GamePeriods } from './game.types';
import { PLayer } from '../player/player.entity';
import { User } from '../users/user.entity';

@ObjectType()
export class Game {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => User)
  owner: User;

  @Field()
  createdAt?: Date;

  @Field(() => Int)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: GamePeriods;

  @Field(() => PLayer, { nullable: true })
  currentPlayerId?: PLayer;

  @Field(() => Boolean)
  private: Boolean;
}