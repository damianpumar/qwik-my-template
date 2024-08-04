import type { QRL } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import type { SubmitHandler } from "@modular-forms/qwik";
import {
  formAction$,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import { PrismaClient } from "@prisma/client";
import * as v from "valibot";

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ),
  remember: v.boolean(),
});

type LoginForm = v.InferInput<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
  remember: true,
}));

export const useFormAction = formAction$<LoginForm>(
  async (values, { cookie, env, redirect, fail }) => {
    const { email, password, remember } = values;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      cookie.set(env.get("SESSION_COOKIE")!, user, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: remember ? 24 * 60 * 60 * 7 : undefined,
      });

      throw redirect(302, "/users");
    }

    return fail(400, {
      message: "The email or password are invalid",
    });
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $((values, event) => {
    // Runs on client
    console.log(values);
  });

  return (
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Login now!</h1>
          <p class="py-6">Welcome to The Platform</p>
        </div>
        <div class="card bg-base-100 w-full max-w-sm flex-shrink-0 shadow-2xl">
          <div class="card-body">
            <Form onSubmit$={handleSubmit}>
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
                        placeholder="Email"
                        class="input input-bordered"
                        value={field.value}
                      />
                      {field.error && (
                        <p class="text-error text-sm">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <Field name="password">
                  {(field, props) => (
                    <div>
                      <input
                        {...props}
                        type="password"
                        placeholder="Password"
                        class="input input-bordered"
                        value={field.value}
                      />
                      {field.error && (
                        <p class="text-error text-sm">{field.error}</p>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Remember</span>
                  <Field name="remember" type="boolean">
                    {(field, props) => (
                      <div>
                        <input
                          {...props}
                          type="checkbox"
                          class="toggle"
                          checked={field.value}
                        />
                        {field.error && (
                          <p class="text-error text-sm">{field.error}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </label>
              </div>

              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary">
                  Login
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login",
    },
  ],
};
