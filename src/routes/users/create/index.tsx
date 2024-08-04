import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, valiForm$ } from "@modular-forms/qwik";
import { PrismaClient } from "@prisma/client";
import * as v from "valibot";

const CreateUserScheme = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Please enter your name.")),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
});

type CreateUser = v.InferInput<typeof CreateUserScheme>;

export const useFormLoader = routeLoader$<InitialValues<CreateUser>>(() => ({
  name: "",
  email: "",
}));

export const useFormAction = formAction$<CreateUser>(
  async (values, { redirect }) => {
    const prisma = new PrismaClient();
    await prisma.user.create({
      data: values,
    });

    throw redirect(302, "/users");
  },
  valiForm$(CreateUserScheme),
);

export default component$(() => {
  const [createUserForm, { Form, Field }] = useForm<CreateUser>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(CreateUserScheme),
  });

  return (
    <>
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/users">Users</a>
          </li>
          <li>
            <a>Create</a>
          </li>
        </ul>
      </div>
      <Form style={{ width: "100%" }}>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <Field name="name">
            {(field, props) => (
              <div>
                <input
                  {...props}
                  class="input input-bordered"
                  value={field.value}
                />
                {field.error && <p class="text-error text-sm">{field.error}</p>}
              </div>
            )}
          </Field>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <Field name="email">
            {(field, props) => (
              <div>
                <input
                  {...props}
                  type="email"
                  class="input input-bordered"
                  value={field.value}
                />
                {field.error && <p class="text-error text-sm">{field.error}</p>}
              </div>
            )}
          </Field>
        </div>

        <div class="mt-5 flex flex-row gap-5">
          <button class="btn">Save</button>
        </div>
      </Form>
    </>
  );
});
