import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.entity';

@ObjectType()
export class SignResponseDTO {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
