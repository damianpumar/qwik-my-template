import { $, component$, noSerialize, Slot } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const onRequest: RequestHandler = async ({
  sharedMap,
  cookie,
  env,
  next,
  pathname,
  redirect,
}) => {
  const user = cookie.get(env.get("SESSION_COOKIE")!);
  sharedMap.set("user", user);

  if (pathname === "/login/") {
    if (user) {
      throw redirect(302, "/users");
    }
  } else if (!user) {
    throw redirect(302, "/login");
  }

  await next();
};

export const useLogoutUser = routeAction$((_, { cookie, env, redirect }) => {
  cookie.set(env.get("SESSION_COOKIE")!, -1, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    maxAge: -1,
  });

  throw redirect(302, "/login");
});

type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
};

export const useUser = routeLoader$(({ sharedMap }): SessionUser => {
  const user = sharedMap.get("user")?.value;

  if (user) {
    const parsed = JSON.parse(user);
    return {
      ...parsed,
      isLoggedIn: true,
    };
  }

  return {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    isLoggedIn: false,
  };
});

export default component$(() => {
  const user = useUser();
  const logout = useLogoutUser();
  const onLogout = $(() => logout.submit());

  if (user.value.isLoggedIn) {
    return (
      <div class="container mx-auto px-4 md:px-0">
        <Navbar items={[{ label: "Logout", action: onLogout }]} />

        <Slot />
      </div>
    );
  }

  return <Slot />;
});
