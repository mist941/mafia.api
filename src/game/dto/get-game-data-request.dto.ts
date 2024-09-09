import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Id } from '../../common.types';

@InputType()
export class GetGameDataRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  playerId: Id;
}