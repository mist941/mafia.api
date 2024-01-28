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
  game: Game;

  @Field(() => PLayer)
  targetPlayer: PLayer;

  @Field(() => PLayer)
  sourcePlayer: PLayer;

  @Field(() => String)
  period: GamePeriods;

  @Field(() => Int)
  step: number;
}