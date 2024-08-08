import type { Signal } from "@builder.io/qwik";
import {
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev, isServer } from "@builder.io/qwik/build";

import "./global.css";

export const ThemeContext = createContextId<Signal<string>>("theme-context"); // <- create the context

export default component$(() => {
  const theme = useSignal("lofi");
  useContextProvider(ThemeContext, theme);

  useTask$(({ track }) => {
    track(() => theme.value);

    if (!isServer) {
      document.querySelector("html")?.setAttribute("data-theme", theme.value);

      localStorage.setItem("theme", theme.value);
    }
  });

  useTask$(
    () => {
      if (!isServer) {
        const themeSaved = localStorage.getItem("theme")!;

        theme.value = themeSaved;
      }
    },
    { eagerness: "load" },
  );

  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
