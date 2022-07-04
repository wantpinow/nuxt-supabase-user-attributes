import { defineNuxtConfig } from "nuxt";
import SupabaseUserAttributes from "..";

export default defineNuxtConfig({
  modules: [SupabaseUserAttributes, "@nuxtjs/supabase"],
  supabaseUserAttributes: {
    tables: {
      user_metadata: "metadata",
      profiles: "profile",
    },
  },
});
