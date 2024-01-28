import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GamePeriods } from './game.types';
import { PLayer } from '../player/player.entity';

@ObjectType()
export class Game {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Game)
  game: Game;

  @Field(() => Int)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: GamePeriods;

  @Field(() => PLayer)
  currentPlayer: PLayer;
}