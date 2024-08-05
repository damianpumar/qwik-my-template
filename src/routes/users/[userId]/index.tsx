import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  useLocation,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import {
  formAction$,
  getValues,
  useForm,
  valiForm$,
} from "@modular-forms/qwik";
import { PrismaClient } from "@prisma/client";
import * as v from "valibot";

const EditUser = v.object({
  firstName: v.pipe(v.string(), v.nonEmpty("Please enter your first name.")),
  lastName: v.pipe(v.string(), v.nonEmpty("Please enter your last name.")),
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
      ...user!,
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
  const navigate = useNavigate();

  const [editUserForm, { Form, Field }] = useForm<EditUser>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(EditUser),
  });
  const values = getValues(editUserForm);

  const location = useLocation();

  const deleteUser = useDeleteUser();

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
          <li>
            <a>
              {values.firstName} {values.lastName}
            </a>
          </li>
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

        <div class="mt-5 flex justify-between">
          <div class="flex gap-5">
            <button
              type="button"
              class="btn"
              onClick$={() => navigate("/users")}
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-success">
              Save
            </button>
          </div>

          <button
            type="button"
            class="btn btn-error"
            onClick$={() =>
              (document.getElementById("deleteModal")! as any).showModal()
            }
          >
            Delete
          </button>
        </div>
      </Form>

      <dialog id="deleteModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Delete!</h3>
          <p class="py-4">Are you sure to delete this user?</p>
          <div class="modal-action">
            <form method="dialog" class="flex flex-row gap-5">
              <button
                type="button"
                class="btn btn-error"
                onClick$={() =>
                  deleteUser.submit({ id: location.params.userId })
                }
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
