import React, { useEffect, useState } from "react";
import { createComponent } from "@lit/react";
import { MdElevatedButton } from "@material/web/button/elevated-button";
import { MdFilledButton } from "@material/web/button/filled-button";
import { MdFilledTonalButton } from "@material/web/button/filled-tonal-button";
import { MdOutlinedButton } from "@material/web/button/outlined-button";
import { MdTextButton } from "@material/web/button/text-button";
import { MdIconButton } from "@material/web/iconbutton/icon-button";
import { MdFilledIconButton } from "@material/web/iconbutton/filled-icon-button";
import { MdFilledTonalIconButton } from "@material/web/iconbutton/filled-tonal-icon-button";
import { MdOutlinedIconButton } from "@material/web/iconbutton/outlined-icon-button";
import { Icon } from "../icon/icon";

export const ElevatedButton = createComponent({
  tagName: "md-elevated-button",
  elementClass: MdElevatedButton,
  react: React,
});

export const FilledButton = createComponent({
  tagName: "md-filled-button",
  elementClass: MdFilledButton,
  react: React,
});

export const FilledTonalButton = createComponent({
  tagName: "md-filled-tonal-button",
  elementClass: MdFilledTonalButton,
  react: React,
});

export const OutlinedButton = createComponent({
  tagName: "md-outlined-button",
  elementClass: MdOutlinedButton,
  react: React,
});

export const TextButton = createComponent({
  tagName: "md-text-button",
  elementClass: MdTextButton,
  react: React,
});

export const IconButton = createComponent({
  tagName: "md-icon-button",
  elementClass: MdIconButton,
  react: React,
});

export const FilledIconButton = createComponent({
  tagName: "md-filled-icon-button",
  elementClass: MdFilledIconButton,
  react: React,
});

export const FilledTonalIconButton = createComponent({
  tagName: "md-filled-tonal-icon-button",
  elementClass: MdFilledTonalIconButton,
  react: React,
});

export const OutlinedIconButton = createComponent({
  tagName: "md-outlined-icon-button",
  elementClass: MdOutlinedIconButton,
  react: React,
});

export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const userTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (userTheme) {
      setTheme(userTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const active = theme === "light";

  return (
    <IconButton onClick={toggleTheme}>
      <Icon>
        <span className={"material-symbols-rounded"}>
          {active ? "dark_mode" : "light_mode"}
        </span>
      </Icon>
    </IconButton>
  );
};
