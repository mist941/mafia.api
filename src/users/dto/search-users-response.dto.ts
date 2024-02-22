import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchUsersResponseDTO {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;
}