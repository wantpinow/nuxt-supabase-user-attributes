import { defineNuxtConfig } from "nuxt";
import supabaseUserAttributes from "..";

export default defineNuxtConfig({
  modules: [supabaseUserAttributes, "@nuxtjs/supabase"],
  supabaseUserAttributes: {
    tables: [
      {
        name: "profiles",
        alias: "profile",
        user_id_column: "id",
        multiple: false,
      },
      {
        name: "user_metadata",
        alias: "metadata",
        user_id_column: "id",
        multiple: false,
      },
    ],
  },
});
