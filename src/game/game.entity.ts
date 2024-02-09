import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Game {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Number)
  ownerId: number;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => ID)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: string;

  @Field({ nullable: true, defaultValue: null })
  currentRole?: string;

  @Field(() => Boolean)
  private: Boolean;
}