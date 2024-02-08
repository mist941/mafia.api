import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

@ObjectType()
export class User {
  @Field(() => Int)
  id?: number;

  @Field()
  email: string;

  @Field()
  @Exclude()
  hashedPassword: string;

  @Field({ nullable: true })
  @Exclude()
  hashedRefreshToken?: string;

  @Field()
  createdAt?: Date;

  @Field()
  username: string;
}
