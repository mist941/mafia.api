import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Id } from '../../common.types';

@ObjectType()
export class InvitePlayersResponseDTO {
  @Field(() => [ID])
  userIds: Id[];

  @Field(() => Int)
  gameId: Id;

  @Field(() => String)
  gameName: string;
}