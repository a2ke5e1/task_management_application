import { MdRipple } from "@material/web/ripple/ripple";
import { createComponent } from "@lit/react";
import React from "react";

export const Ripple = createComponent({
  tagName: "md-ripple",
  elementClass: MdRipple,
  react: React,
});