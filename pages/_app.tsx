import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

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

  function cycleTheme() {
    if (theme === "light") applyTheme("dark");
    else if (theme === "dark") applyTheme("system");
    else applyTheme("light");
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="alternate icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
      <div className="theme-switch">
        <div className="theme-group" role="group" aria-label="Selector de tema">
          <button
            type="button"
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            aria-label="Tema claro"
            title="Tema claro"
            onClick={() => applyTheme("light")}
          >
            <span className="icon sun" />
          </button>
          <button
            type="button"
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            aria-label="Tema oscuro"
            title="Tema oscuro"
            onClick={() => applyTheme("dark")}
          >
            <span className="icon moon" />
          </button>
          <button
            type="button"
            className={`theme-btn ${theme === "system" ? "active" : ""}`}
            aria-label="Tema sistema"
            title="Tema sistema"
            onClick={() => applyTheme("system")}
          >
            <span className="icon system" />
          </button>
        </div>
      </div>
      <Analytics />
    </>
  );
}
