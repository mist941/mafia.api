import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensResponseDTO {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
