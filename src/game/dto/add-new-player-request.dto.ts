import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Id } from '../../common.types';

@InputType()
export class AddNewPlayerRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;
}