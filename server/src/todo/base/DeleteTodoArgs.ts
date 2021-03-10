import { ArgsType, Field } from "@nestjs/graphql";
import { TodoWhereUniqueInput } from "./TodoWhereUniqueInput";

@ArgsType()
class DeleteTodoArgs {
  @Field(() => TodoWhereUniqueInput, { nullable: false })
  where!: TodoWhereUniqueInput;
}

export { DeleteTodoArgs };
