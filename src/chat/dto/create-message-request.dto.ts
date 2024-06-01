import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Id } from '../../common.types';

@InputType()
export class CreateMessageRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  gameId: Id;

  @IsNotEmpty()
  @IsString()
  @Field()
  text: string;
}