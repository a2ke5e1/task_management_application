import React from "react";
import { createComponent } from "@lit/react";
import { MdDivider } from "@material/web/divider/divider";

export const Divider = createComponent({
  tagName: "md-divider",
  elementClass: MdDivider,
  react: React,
});
