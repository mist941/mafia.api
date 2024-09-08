import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../game/game.entity';
import { User } from '../users/user.entity';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => Boolean)
  mafiaChat: boolean;

  @Field(() => Game)
  triadaChat: boolean;

  @Field()
  createdAt: Date;

  @Field(() => Game)
  game: Game;

  @Field(() => User)
  user: User;
}