import {
  defineNuxtPlugin,
  useRuntimeConfig,
  // @ts-ignore
  useSupabaseClient,
  // @ts-ignore
} from "#imports";
import { useSupabaseUserAttributes } from "../composables/useSupabaseUserAttributes";

export default defineNuxtPlugin(async (nuxtApp) => {
  const client = useSupabaseClient();
  const user_attributes = useSupabaseUserAttributes();
  const config = useRuntimeConfig();

  const tables = config.public.supabaseUserAttributes.tables;

  nuxtApp.hooks.hook("app:mounted", () => {
    client.auth.onAuthStateChange(async (event, session) => {
      if (event == "SIGNED_IN") {
        for (let i = 0; i < tables.length; i++) {
          const table = tables[i];
          const table_name = table.name;
          const table_alias = table.alias ?? table.name;
          const user_id_column = table.user_id_column ?? "id";

          const { data, error } = await client
            .from(table_name)
            .select("*")
            .eq(user_id_column, session.user.id);

          let value = null;
          if (!error) {
            if (table.multiple) {
              value = data;
            } else if (data.length == 1) {
              value = data[0];
            }
          }
          user_attributes[table_alias].value = value;
        }
      } else if (event == "SIGNED_OUT") {
        for (let i = 0; i < tables.length; i++) {
          const table = tables[i];
          const table_alias = table.alias ?? table.name;
          user_attributes[table_alias].value = null;
        }
      }
    });
  });
});
