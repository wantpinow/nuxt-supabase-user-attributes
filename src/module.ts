import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineNuxtModule, addPlugin } from "@nuxt/kit";

export interface ModuleOptions {
  tables: Array<string>;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-supabase-user-attributes",
    configKey: "supabaseUserAttributes",
  },
  defaults: {
    tables: [],
  },
  setup(options, nuxt) {
    // Set the tables to be used with the module
    nuxt.options.runtimeConfig.public.supabaseUserAttributesTables =
      options.tables;

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(runtimeDir, "plugins", "userAttributes.server"));
    addPlugin(resolve(runtimeDir, "plugins", "userAttributes.client"));

    // add composables
    nuxt.hook("autoImports:dirs", (dirs) => {
      dirs.push(resolve(runtimeDir, "composables"));
    });
  },
});
