import { PrismaService } from "nestjs-prisma";
import {
  FindOneTodoArgs,
  FindManyTodoArgs,
  TodoCreateArgs,
  TodoUpdateArgs,
  TodoDeleteArgs,
  Subset,
} from "@prisma/client";

export class TodoServiceBase {
  constructor(protected readonly prisma: PrismaService) {}
  findMany<T extends FindManyTodoArgs>(args: Subset<T, FindManyTodoArgs>) {
    return this.prisma.todo.findMany(args);
  }
  findOne<T extends FindOneTodoArgs>(args: Subset<T, FindOneTodoArgs>) {
    return this.prisma.todo.findOne(args);
  }
  create<T extends TodoCreateArgs>(args: Subset<T, TodoCreateArgs>) {
    return this.prisma.todo.create<T>(args);
  }
  update<T extends TodoUpdateArgs>(args: Subset<T, TodoUpdateArgs>) {
    return this.prisma.todo.update<T>(args);
  }
  delete<T extends TodoDeleteArgs>(args: Subset<T, TodoDeleteArgs>) {
    return this.prisma.todo.delete(args);
  }
}
