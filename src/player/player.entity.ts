import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.entity';

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
}