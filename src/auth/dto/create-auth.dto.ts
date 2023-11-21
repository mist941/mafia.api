import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthDto {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
