import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id?: number;

  @Field()
  email: string;

  @Field()
  hashedPassword: string;

  @Field()
  username: string;
}
