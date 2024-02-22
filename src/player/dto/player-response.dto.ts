import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlayerResponseDTO {
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