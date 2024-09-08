import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Player } from '../player/player.entity';
import { GamePeriods } from '../game/game.types';
import { Game } from '../game/game.entity';
import { ActionTypes } from './action.types';

@ObjectType()
export class Action {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field(() => Game)
  gameId: Game;

  @Field(() => String)
  actionType: ActionTypes;

  @Field(() => Player)
  targetPlayerId: Player;

  @Field(() => Player)
  sourcePlayerId: Player;

  @Field(() => String)
  period: GamePeriods;

  @Field(() => Int)
  step: number;
}