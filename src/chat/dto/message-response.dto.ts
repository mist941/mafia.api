import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Game } from '../../game/game.entity';
import { User } from '../../users/user.entity';
import { Id } from '../../common.types';

@ObjectType()
export class MessageResponseDTO {
  @Field(() => ID)
  id: Id;

  @Field(() => Game)
  game: Game;

  @Field(() => User)
  user: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  text: string;
}
