import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Id } from '../../common.types';

@InputType()
export class InvitePlayersRequestDTO {
  @IsNotEmpty()
  @IsArray()
  @Field()
  playerIds: Id[];

  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;
}