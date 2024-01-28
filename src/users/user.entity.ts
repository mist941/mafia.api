import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id?: number;

  @Field()
  email: string;

  @Field()
  hashedPassword: string;

  @Field({ nullable: true })
  hashedRefreshToken?: string;

  @Field()
  createdAt?: Date;

  @Field()
  username: string;
}
