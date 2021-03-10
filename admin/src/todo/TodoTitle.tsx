import React from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { api } from "../api";
import { Todo } from "../api/todo/Todo";

type Props = { id: string };

export const TodoTitle = ({ id }: Props) => {
  const { data, isLoading, isError, error } = useQuery<
    Todo,
    AxiosError,
    [string, string]
  >(["get-/api/todos", id], async (key: string, id: string) => {
    const response = await api.get(`${"/api/todos"}/${id}`);
    return response.data;
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <Link to={`${"/api/todos"}/${id}`} className="entity-id">
      {data?.title && data?.title.length ? data.title : data?.id}
    </Link>
  );
};
