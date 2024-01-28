import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PLayer } from '../player/player.entity';
import { GamePeriods } from '../game/game.types';
import { Game } from '../game/game.entity';

@ObjectType()
export class Action {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field(() => Game)
  gameId: Game;

  @Field(() => PLayer)
  targetPlayerId: PLayer;

  @Field(() => PLayer)
  sourcePlayerId: PLayer;

  @Field(() => String)
  period: GamePeriods;

  @Field(() => Int)
  step: number;
}