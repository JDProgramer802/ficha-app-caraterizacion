import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import ActionMenu from "../components/ActionMenu";
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("theme") as "system" | "light" | "dark") || "system";
    applyTheme(saved);
  }, []);

  function applyTheme(next: "system" | "light" | "dark") {
    setTheme(next);
    if (typeof document !== "undefined") {
      if (next === "system") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", next);
      }
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", next);
    }
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="alternate icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <div className="theme-switch">
        <ActionMenu
          label={theme === "dark" ? "Tema: Oscuro" : theme === "light" ? "Tema: Claro" : "Tema: Sistema"}
          ariaLabel="Selector de tema"
          align="right"
          items={[
            { label: "Claro", onClick: () => applyTheme("light") },
            { label: "Oscuro", onClick: () => applyTheme("dark") },
            { label: "Sistema", onClick: () => applyTheme("system") },
          ]}
        />
      </div>
    </>
  );
}
