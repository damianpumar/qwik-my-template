import type { QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { useUser } from "~/routes/layout";
import { LuRocket } from "@qwikest/icons/lucide";

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
    <div class="navbar bg-base-100 p-0">
      <div class="flex-1">
        <div class="btn btn-ghost pointer-events-none text-xl normal-case	">
          <a href="/">The platform</a>
          <LuRocket />
        </div>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div tabIndex={0} class="avatar placeholder btn btn-circle btn-ghost">
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
            {items.map(({ label, action }) => (
              <li key={label}>
                <button onClick$={action}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
