import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlayerResponseDto {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  status: string;

  @Field(() => String)
  role: string;

  @Field(() => Number)
  userId: number;

  @Field(() => String)
  username: string;
}