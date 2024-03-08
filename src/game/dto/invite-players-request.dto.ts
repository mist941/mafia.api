import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Id } from '../../common.types';

@InputType()
export class InvitePlayersRequestDTO {
  @IsNotEmpty()
  @IsArray()
  @Field(() => [ID])
  userIds: Id[];

  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;

  @IsNotEmpty()
  @IsString()
  @Field()
  gameName: string;
}