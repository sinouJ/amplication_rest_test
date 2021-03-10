import * as React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";
import { TodoList } from "./TodoList";
import { CreateTodo } from "./CreateTodo";
import { Todo } from "./Todo";

export const TodoIndex = (): React.ReactElement => {
  useBreadcrumbs("/todos/", "Todos");

  return (
    <Switch>
      <PrivateRoute exact path={"/todos/"} component={TodoList} />
      <PrivateRoute path={"/todos/new"} component={CreateTodo} />
      <PrivateRoute path={"/todos/:id"} component={Todo} />
    </Switch>
  );
};
