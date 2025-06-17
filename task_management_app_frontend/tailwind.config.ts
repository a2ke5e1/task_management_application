import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--md-sys-color-primary)",
        "surface-tint": "var(--md-sys-color-surface-tint)",
        "on-primary": "var(--md-sys-color-on-primary)",
        "primary-container": "var(--md-sys-color-primary-container)",
        "on-primary-container": "var(--md-sys-color-on-primary-container)",
        secondary: "var(--md-sys-color-secondary)",
        "on-secondary": "var(--md-sys-color-on-secondary)",
        "secondary-container": "var(--md-sys-color-secondary-container)",
        "on-secondary-container": "var(--md-sys-color-on-secondary-container)",
        tertiary: "var(--md-sys-color-tertiary)",
        "on-tertiary": "var(--md-sys-color-on-tertiary)",
        "tertiary-container": "var(--md-sys-color-tertiary-container)",
        "on-tertiary-container": "var(--md-sys-color-on-tertiary-container)",
        error: "var(--md-sys-color-error)",
        "on-error": "var(--md-sys-color-on-error)",
        "error-container": "var(--md-sys-color-error-container)",
        "on-error-container": "var(--md-sys-color-on-error-container)",
        background: "var(--md-sys-color-background)",
        "on-background": "var(--md-sys-color-on-background)",
        surface: "var(--md-sys-color-surface)",
        "on-surface": "var(--md-sys-color-on-surface)",
        "surface-variant": "var(--md-sys-color-surface-variant)",
        "on-surface-variant": "var(--md-sys-color-on-surface-variant)",
        outline: "var(--md-sys-color-outline)",
        "outline-variant": "var(--md-sys-color-outline-variant)",
        shadow: "var(--md-sys-color-shadow)",
        scrim: "var(--md-sys-color-scrim)",
        "inverse-surface": "var(--md-sys-color-inverse-surface)",
        "inverse-on-surface": "var(--md-sys-color-inverse-on-surface)",
        "inverse-primary": "var(--md-sys-color-inverse-primary)",
        "primary-fixed": "var(--md-sys-color-primary-fixed)",
        "on-primary-fixed": "var(--md-sys-color-on-primary-fixed)",
        "primary-fixed-dim": "var(--md-sys-color-primary-fixed-dim)",
        "on-primary-fixed-variant":
          "var(--md-sys-color-on-primary-fixed-variant)",
        "secondary-fixed": "var(--md-sys-color-secondary-fixed)",
        "on-secondary-fixed": "var(--md-sys-color-on-secondary-fixed)",
        "secondary-fixed-dim": "var(--md-sys-color-secondary-fixed-dim)",
        "on-secondary-fixed-variant":
          "var(--md-sys-color-on-secondary-fixed-variant)",
        "tertiary-fixed": "var(--md-sys-color-tertiary-fixed)",
        "on-tertiary-fixed": "var(--md-sys-color-on-tertiary-fixed)",
        "tertiary-fixed-dim": "var(--md-sys-color-tertiary-fixed-dim)",
        "on-tertiary-fixed-variant":
          "var(--md-sys-color-on-tertiary-fixed-variant)",
        "surface-dim": "var(--md-sys-color-surface-dim)",
        "surface-bright": "var(--md-sys-color-surface-bright)",
        "surface-container-lowest":
          "var(--md-sys-color-surface-container-lowest)",
        "surface-container-low": "var(--md-sys-color-surface-container-low)",
        "surface-container": "var(--md-sys-color-surface-container)",
        "surface-container-high": "var(--md-sys-color-surface-container-high)",
        "surface-container-highest":
          "var(--md-sys-color-surface-container-highest)",
      },
      fontSize: {
        "display-small": [
          "var(--md-sys-typescale-display-small-size, 2.25rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-display-small-line-height, 2.75rem)",
            fontWeight:
              "var(--md-sys-typescale-display-small-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "display-medium": [
          "var(--md-sys-typescale-display-medium-size, 2.8125rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-display-medium-line-height, 3.25rem)",
            fontWeight:
              "var(--md-sys-typescale-display-medium-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "display-large": [
          "var(--md-sys-typescale-display-large-size, 3.5625rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-display-large-line-height, 4rem)",
            fontWeight:
              "var(--md-sys-typescale-display-large-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "headline-small": [
          "var(--md-sys-typescale-headline-small-size, 1.5rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-headline-small-line-height, 2rem)",
            fontWeight:
              "var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "headline-medium": [
          "var(--md-sys-typescale-headline-medium-size, 1.75rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-headline-medium-line-height, 2.25rem)",
            fontWeight:
              "var(--md-sys-typescale-headline-medium-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "headline-large": [
          "var(--md-sys-typescale-headline-large-size, 2rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-headline-large-line-height, 2.5rem)",
            fontWeight:
              "var(--md-sys-typescale-headline-large-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "title-small": [
          "var(--md-sys-typescale-title-small-size, 0.875rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-title-small-line-height, 1.25rem)",
            fontWeight:
              "var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500))",
          },
        ],
        "title-medium": [
          "var(--md-sys-typescale-title-medium-size, 1rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-title-medium-line-height, 1.5rem)",
            fontWeight:
              "var(--md-sys-typescale-title-medium-weight, var(--md-ref-typeface-weight-medium, 500))",
          },
        ],
        "title-large": [
          "var(--md-sys-typescale-title-large-size, 1.375rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-title-large-line-height, 1.75rem)",
            fontWeight:
              "var(--md-sys-typescale-title-large-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "body-small": [
          "var(--md-sys-typescale-body-small-size, 0.75rem)",
          {
            lineHeight: "var(--md-sys-typescale-body-small-line-height, 1rem)",
            fontWeight:
              "var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "body-medium": [
          "var(--md-sys-typescale-body-medium-size, 0.875rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-body-medium-line-height, 1.25rem)",
            fontWeight:
              "var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "body-large": [
          "var(--md-sys-typescale-body-large-size, 1rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-body-large-line-height, 1.5rem)",
            fontWeight:
              "var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400))",
          },
        ],
        "label-small": [
          "var(--md-sys-typescale-label-small-size, 0.6875rem)",
          {
            lineHeight: "var(--md-sys-typescale-label-small-line-height, 1rem)",
            fontWeight:
              "var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500))",
          },
        ],
        "label-medium": [
          "var(--md-sys-typescale-label-medium-size, 0.75rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-label-medium-line-height, 1rem)",
            fontWeight:
              "var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500))",
          },
        ],
        "label-large": [
          "var(--md-sys-typescale-label-large-size, 0.875rem)",
          {
            lineHeight:
              "var(--md-sys-typescale-label-large-line-height, 1.25rem)",
            fontWeight:
              "var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500))",
          },
        ],
      },
      screens: {
        desktop: "1280px",
      },
    },
  },
};
export default config;
