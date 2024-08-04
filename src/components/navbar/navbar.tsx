import { component$ } from "@builder.io/qwik";
import { useUser } from "~/routes/layout";

export interface MenuItem {
  label: string;
  action: Function;
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
      <div class="flex-1">
        <div class="btn btn-ghost text-xl normal-case">The platform</div>
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
                <a onClick$={() => action()}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
