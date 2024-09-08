import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Player {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  gameId: number;

  @Field(() => String)
  status: string;

  @Field({ nullable: false, defaultValue: false })
  ready: boolean;

  @Field(() => String)
  role: string;

  @Field(() => Boolean)
  madeAction: boolean;
}