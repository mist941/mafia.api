import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
