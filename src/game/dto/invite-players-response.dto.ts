import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Id } from '../../common.types';

@ObjectType()
export class InvitePlayersResponseDTO {
  @Field(() => [Int])
  playerIds: Id[];

  @Field(() => Int)
  gameId: Id;
}