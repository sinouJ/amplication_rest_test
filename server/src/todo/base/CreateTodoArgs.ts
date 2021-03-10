import { ArgsType, Field } from "@nestjs/graphql";
import { TodoCreateInput } from "./TodoCreateInput";

@ArgsType()
class CreateTodoArgs {
  @Field(() => TodoCreateInput, { nullable: false })
  data!: TodoCreateInput;
}

export { CreateTodoArgs };
