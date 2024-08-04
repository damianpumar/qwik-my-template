import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import {
  formAction$,
  formAction$,
  useForm,
  valiForm$,
} from "@modular-forms/qwik";
import { PrismaClient } from "@prisma/client";
import * as v from "valibot";

const EditUser = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Please enter your name.")),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
});

type EditUser = v.InferInput<typeof EditUser>;

export const useFormLoader = routeLoader$<InitialValues<EditUser>>(
  async ({ params }) => {
    const userId = parseInt(params["userId"], 10);

    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return {
      email: user?.email,
      name: user!.name!,
    };
  },
);

export const useFormAction = formAction$<EditUser>(
  async (data, { params, redirect }) => {
    const userId = parseInt(params["userId"], 10);

    const prisma = new PrismaClient();

    await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });

    throw redirect(302, "/users");
  },
  valiForm$(EditUser),
);

export const useDeleteUser = routeAction$(
  async (data, { redirect }) => {
    const prisma = new PrismaClient();
    await prisma.user.delete({
      where: {
        id: parseInt(data.id),
      },
    });

    throw redirect(302, "/users");
  },
  zod$({
    id: z.string(),
  }),
);

export default component$(() => {
  const [editUserForm, { Form, Field }] = useForm<EditUser>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(EditUser),
  });
  const onDeleteUser = useDeleteUser();

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
            <Field name="name">{(field) => <a>{field.value}</a>}</Field>
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

      <dialog id="deleteModal" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Delete!</h3>
          <p class="py-4">Are you sure to delete this user?</p>
          <div class="modal-action">
            <form action="" class="flex flex-row gap-5">
              <button
                type="button"
                class="btn btn-error"
                onClick$={() => onDeleteUser.submit({ id: user.value!.id })}
              >
                Delete
              </button>

              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
});
