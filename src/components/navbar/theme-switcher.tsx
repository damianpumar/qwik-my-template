import { component$, useContext } from "@builder.io/qwik";
import { LuSun, LuMoon } from "@qwikest/icons/lucide";
import { ThemeContext } from "~/root";

export const ThemeSwitcher = component$(() => {
  const themeContext = useContext(ThemeContext);

  return (
    <label class="swap">
      <input
        type="checkbox"
        onChange$={(e: any) => {
          const theme = e.target.checked ? "lofi" : "black";

          themeContext.value = theme;
        }}
        checked={themeContext.value === "lofi" ? true : false}
      />

      <LuSun class="swap-on h-6 w-6 fill-current" />
      <LuMoon class="swap-off h-6 w-6 fill-current" />
    </label>
  );
});
