import { ArgsType, Field } from "@nestjs/graphql";
import { TodoWhereUniqueInput } from "./TodoWhereUniqueInput";

@ArgsType()
class FindOneTodoArgs {
  @Field(() => TodoWhereUniqueInput, { nullable: false })
  where!: TodoWhereUniqueInput;
}

export { FindOneTodoArgs };
