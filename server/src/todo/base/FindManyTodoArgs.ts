import { ArgsType, Field } from "@nestjs/graphql";
import { TodoWhereInput } from "./TodoWhereInput";

@ArgsType()
class FindManyTodoArgs {
  @Field(() => TodoWhereInput, { nullable: true })
  where?: TodoWhereInput;
}

export { FindManyTodoArgs };
