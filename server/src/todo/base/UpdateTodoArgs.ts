import { ArgsType, Field } from "@nestjs/graphql";
import { TodoWhereUniqueInput } from "./TodoWhereUniqueInput";
import { TodoUpdateInput } from "./TodoUpdateInput";

@ArgsType()
class UpdateTodoArgs {
  @Field(() => TodoWhereUniqueInput, { nullable: false })
  where!: TodoWhereUniqueInput;
  @Field(() => TodoUpdateInput, { nullable: false })
  data!: TodoUpdateInput;
}

export { UpdateTodoArgs };
