import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GameResponseDTO {

  @Field()
  id: number;

  @Field()
  name: string;
}
