import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineNuxtModule, addPlugin } from "@nuxt/kit";

interface UserAttributesConfig {
  name: string;
  alias?: string;
  user_id_column?: string;
  multiple?: boolean;
}

export interface ModuleOptions {
  tables: UserAttributesConfig[];
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
    // Add config to runtime
    nuxt.options.runtimeConfig.public.supabaseUserAttributes = {
      tables: options.tables,
    };

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    // Transpile supabase
    // nuxt.options.build.transpile.push("@nuxt/supabase");

    // Add supabase composables
    nuxt.hook("autoImports:dirs", (dirs) => {
      dirs.push(resolve(runtimeDir, "composables"));
    });

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(runtimeDir, "plugins", "userAttributes.server"));
    addPlugin(resolve(runtimeDir, "plugins", "userAttributes.client"));
  },
});
