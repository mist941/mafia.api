import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PLayer {
  @Field(() => Int)
  id: number;

  @Field(() => ID)
  userId: number;

  @Field(() => String)
  status: string;

  @Field({ nullable: false, defaultValue: false })
  ready: boolean;

  @Field(() => String)
  role: string;

  @Field(() => ID)
  gameId: number;
}