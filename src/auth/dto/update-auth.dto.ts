import { CreateAuthDto } from './create-auth.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @Field(() => Int)
  id: number;
}
