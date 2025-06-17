"use client";

import React from "react";

import { createComponent } from "@lit/react";
import { MdDialog } from "@material/web/dialog/dialog";

export const Dialog = createComponent({
  tagName: "md-dialog",
  elementClass: MdDialog,
  react: React,
  events: {
    open: "open",
    opened: "opened",
    close: "close",
    closed: "closed",
    cancel: "cancel",
  },
});
