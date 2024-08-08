import { type QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { useUser } from "~/routes/layout";
import { LuRocket } from "@qwikest/icons/lucide";
import { ThemeSwitcher } from "./theme-switcher";

export interface MenuItem {
  label: string;
  action: QRL<() => unknown>;
}

interface NavbarProps {
  items: MenuItem[];
}

export const Navbar = component$(({ items }: NavbarProps) => {
  const user = useUser();

  const userInitials = user.value.firstName
    .split(" ")
    .map((letter) => letter[0])
    .join("");

  return (
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/users">Users</a>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <div class="btn btn-ghost pointer-events-none w-max text-sm normal-case md:text-xl">
            The platform
            <LuRocket class="h-6 w-6" />
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="flex gap-5">
          <ThemeSwitcher />
          <div class="dropdown dropdown-end">
            <div
              tabIndex={0}
              class="avatar placeholder btn btn-circle btn-ghost"
            >
              <div class="avatar placeholder">
                <div class="w-12 rounded-full bg-neutral text-neutral-content">
                  <span class="text-xs uppercase">{userInitials}</span>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <button>My Profile</button>
              </li>
              {items.map(({ label, action }) => (
                <li key={label}>
                  <button onClick$={action}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
