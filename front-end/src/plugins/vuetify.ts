/**

plugins/vuetify.ts*
Framework documentation: https://vuetifyjs.com`/*/

// plugins/vuetify.ts
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { VBtn } from "vuetify/lib/components/index.mjs";
import { pt } from "vuetify/locale";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#ffffff",
    surface: "#f5f5f5",
    primary: "#ff5a5f",
    secondary: "#94a3b8",
    error: "#ff5a5f",
    info: "#60a5fa",
    success: "#22c55e",
    warning: "#facc15",
  },
};

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#0f1724",
    surface: "#0b1220",
    primary: "#ff5a5f",
    secondary: "#94a3b8",
    error: "#ff5a5f",
    info: "#60a5fa",
    success: "#22c55e",
    warning: "#facc15",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomDarkTheme",
    themes: {
      myCustomDarkTheme,
      myCustomLightTheme,
    },
  },
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: "pt",
    fallback: "pt",
    messages: { pt },
  },
  aliases: {
    VBtnAction: VBtn,
    VBtnSecondary: VBtn,
    VBtnEdit: VBtn,
    VBtnDelete: VBtn,
    VBtnDetails: VBtn,
    VBtnGeneric: VBtn,
  },
  defaults: {
    VBtn: {
      style: { textTransform: "none" },
    },
    VBtnAction: {
      color: "primary",
      variant: "flat",
      style: {
        textTransform: "none",
      },
    },
    VBtnSecondary: {
      color: "primary",
      variant: "outlined",
      style: { textTransform: "none" },
    },
    VBtnEdit: {
      color: "primary",
      variant: "text",
      icon: "mdi-pencil",
      style: { textTransform: "none" },
    },
    VBtnDelete: {
      color: "primary",
      variant: "text",
      icon: "mdi-close",
      style: { textTransform: "none" },
    },
    VBtnDetails: {
      color: "primary",
      variant: "text",
      icon: "mdi-eye",
      style: { textTransform: "none" },
    },
    VBtnGeneric: {
      color: "primary",
      variant: "text",
      style: { textTransform: "none" },
    },
  },
});
