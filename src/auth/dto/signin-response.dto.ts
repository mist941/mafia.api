import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class SigninResponseDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  refreshToken: string;

  @IsNotEmpty()
  @Field(() => User)
  user: User;
}
