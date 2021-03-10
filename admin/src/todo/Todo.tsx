import * as React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { Formik } from "formik";
import pick from "lodash.pick";

import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
  Snackbar,
  EnumButtonStyle,
  TextField,
  ToggleField,
} from "@amplication/design-system";

import { api } from "../api";
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";
import { Todo as TTodo } from "../api/todo/Todo";
import { TodoUpdateInput } from "../api/todo/TodoUpdateInput";

export const Todo = (): React.ReactElement => {
  const match = useRouteMatch<{ id: string }>("/todos/:id/");
  const id = match?.params?.id;
  const history = useHistory();

  const { data, isLoading, isError, error } = useQuery<
    TTodo,
    AxiosError,
    [string, string]
  >(["get-/api/todos", id], async (key: string, id: string) => {
    const response = await api.get(`${"/api/todos"}/${id}`);
    return response.data;
  });

  const [deleteEntity] = useMutation<TTodo, AxiosError>(
    async (data) => {
      const response = await api.delete(`${"/api/todos"}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        history.push("//todos");
      },
    }
  );

  const [
    update,
    { error: updateError, isError: updateIsError, isLoading: updateIsLoading },
  ] = useMutation<TTodo, AxiosError, TodoUpdateInput>(async (data) => {
    const response = await api.patch(`${"/api/todos"}/${id}`, data);
    return response.data;
  });

  const handleSubmit = React.useCallback(
    (values: TodoUpdateInput) => {
      void update(values);
    },
    [update]
  );

  useBreadcrumbs(match?.url, data?.title);

  const handleDelete = React.useCallback(() => {
    void deleteEntity();
  }, [deleteEntity]);

  const errorMessage =
    updateError?.response?.data?.message || error?.response?.data?.message;

  const initialValues = React.useMemo(
    () => pick(data, ["description", "isCompleted", "title"]),
    [data]
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {data && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form
            formStyle={EnumFormStyle.Horizontal}
            formHeaderContent={
              <FormHeader
                title={`${"Todo"} ${
                  data?.title && data?.title.length ? data.title : data?.id
                }`}
              >
                <Button
                  type="button"
                  disabled={updateIsLoading}
                  buttonStyle={EnumButtonStyle.Secondary}
                  icon="trash_2"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button type="submit" disabled={updateIsLoading}>
                  Save
                </Button>
              </FormHeader>
            }
          >
            <div>
              <TextField label="Description" name="description" textarea />
            </div>
            <div>
              <ToggleField label="Is Completed" name="isCompleted" />
            </div>
            <div>
              <TextField label="Title" name="title" />
            </div>
          </Form>
        </Formik>
      )}
      <Snackbar open={isError || updateIsError} message={errorMessage} />
    </>
  );
};
