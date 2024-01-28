import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateGameRequestDTO {
  @IsNotEmpty()
  @IsString()
  @Field()
  gameName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(5)
  @Max(19)
  @Field()
  numberOfPlayers: number;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  private: boolean;
}