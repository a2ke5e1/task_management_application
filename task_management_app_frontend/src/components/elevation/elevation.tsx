import React from "react";
import { createComponent } from "@lit/react";
import { MdElevation } from "@material/web/elevation/elevation";

export const Elevation = createComponent({
  tagName: "md-elevation",
  elementClass: MdElevation,
  react: React,
});
