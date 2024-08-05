import { component$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, valiForm$ } from "@modular-forms/qwik";
import { PrismaClient } from "@prisma/client";
import * as v from "valibot";

const CreateUserScheme = v.object({
  firstName: v.pipe(v.string(), v.nonEmpty("Please enter your first name.")),
  lastName: v.pipe(v.string(), v.nonEmpty("Please enter your last name.")),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
});

type CreateUser = v.InferInput<typeof CreateUserScheme>;

export const useFormLoader = routeLoader$<InitialValues<CreateUser>>(() => ({
  firstName: "",
  lastName: "",
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

  const navigate = useNavigate();

  return (
    <>
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/users">Users</a>
          </li>
          <li>Create</li>
        </ul>
      </div>
      <Form style={{ width: "100%" }}>
        <div class="form-control">
          <label class="label">
            <span class="label-text">First Name</span>
          </label>
          <Field name="firstName">
            {(field, props) => (
              <div>
                <input
                  {...props}
                  class="input input-bordered"
                  value={field.value}
                />
                {field.error && <p class="text-sm text-error">{field.error}</p>}
              </div>
            )}
          </Field>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Last Name</span>
          </label>
          <Field name="lastName">
            {(field, props) => (
              <div>
                <input
                  {...props}
                  class="input input-bordered"
                  value={field.value}
                />
                {field.error && <p class="text-sm text-error">{field.error}</p>}
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
                {field.error && <p class="text-sm text-error">{field.error}</p>}
              </div>
            )}
          </Field>
        </div>

        <div class="mt-5 flex gap-5">
          <button type="button" class="btn" onClick$={() => navigate("/users")}>
            Cancel
          </button>
          <button type="submit" class="btn btn-success">
            Save
          </button>
        </div>
      </Form>
    </>
  );
});
