import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
import * as gqlBasicAuthGuard from "../../auth/gqlBasicAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import * as gqlUserRoles from "../../auth/gqlUserRoles.decorator";
import * as abacUtil from "../../auth/abac.util";
import { isRecordNotFoundError } from "../../prisma.util";
import { CreateTodoArgs } from "./CreateTodoArgs";
import { UpdateTodoArgs } from "./UpdateTodoArgs";
import { DeleteTodoArgs } from "./DeleteTodoArgs";
import { FindManyTodoArgs } from "./FindManyTodoArgs";
import { FindOneTodoArgs } from "./FindOneTodoArgs";
import { Todo } from "./Todo";
import { TodoService } from "../todo.service";

@graphql.Resolver(() => Todo)
@common.UseGuards(gqlBasicAuthGuard.GqlBasicAuthGuard, gqlACGuard.GqlACGuard)
export class TodoResolverBase {
  constructor(
    protected readonly service: TodoService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => [Todo])
  @nestAccessControl.UseRoles({
    resource: "Todo",
    action: "read",
    possession: "any",
  })
  async todos(
    @graphql.Args() args: FindManyTodoArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<Todo[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: "Todo",
    });
    const results = await this.service.findMany(args);
    return results.map((result) => permission.filter(result));
  }

  @graphql.Query(() => Todo, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "Todo",
    action: "read",
    possession: "own",
  })
  async todo(
    @graphql.Args() args: FindOneTodoArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<Todo | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "own",
      resource: "Todo",
    });
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return permission.filter(result);
  }

  @graphql.Mutation(() => Todo)
  @nestAccessControl.UseRoles({
    resource: "Todo",
    action: "create",
    possession: "any",
  })
  async createTodo(
    @graphql.Args() args: CreateTodoArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<Todo> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "create",
      possession: "any",
      resource: "Todo",
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(
      permission,
      args.data
    );
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new apollo.ApolloError(
        `providing the properties: ${properties} on ${"Todo"} creation is forbidden for roles: ${roles}`
      );
    }
    // @ts-ignore
    return await this.service.create({
      ...args,
      data: args.data,
    });
  }

  @graphql.Mutation(() => Todo)
  @nestAccessControl.UseRoles({
    resource: "Todo",
    action: "update",
    possession: "any",
  })
  async updateTodo(
    @graphql.Args() args: UpdateTodoArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<Todo | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: "Todo",
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(
      permission,
      args.data
    );
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new apollo.ApolloError(
        `providing the properties: ${properties} on ${"Todo"} update is forbidden for roles: ${roles}`
      );
    }
    try {
      // @ts-ignore
      return await this.service.update({
        ...args,
        data: args.data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => Todo)
  @nestAccessControl.UseRoles({
    resource: "Todo",
    action: "delete",
    possession: "any",
  })
  async deleteTodo(@graphql.Args() args: DeleteTodoArgs): Promise<Todo | null> {
    try {
      // @ts-ignore
      return await this.service.delete(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }
}
