import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Id } from '../../common.types';
import { ActionTypes } from '../../action/action.types';
import { GamePeriods } from '../game.types';

@InputType()
export class CreateActionRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  playerId: Id;

  @ValidateIf((_, value) => value)
  @IsNumber()
  @Field({ nullable: true })
  targetPlayerId?: Id;

  @IsNotEmpty()
  @IsString()
  @Field()
  actionType: ActionTypes;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  step: number;

  @IsNotEmpty()
  @IsString()
  @Field()
  period: GamePeriods;
}