import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Id } from '../../common.types';

@ObjectType()
export class InvitePlayersResponseDTO {
  @Field(() => String)
  gameName: string;

  @Field(() => Int)
  gameId: Id;
}