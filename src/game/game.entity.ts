import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Number)
  numberOfPlayers: number;

  @Field(() => String)
  currentPeriod: string;

  @Field({ nullable: true, defaultValue: null })
  currentRole?: string;

  @Field(() => Boolean)
  private: Boolean;

  @Field({ nullable: false, defaultValue: 0 })
  step: number;
}