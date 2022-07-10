import {
  defineNuxtPlugin,
  useRuntimeConfig,
  // @ts-ignore
  useSupabaseClient,
  // @ts-ignore
  useSupabaseUser,
  // @ts-ignore
} from "#imports";
import { useSupabaseUserAttributes } from "../composables/useSupabaseUserAttributes";

export default defineNuxtPlugin(async (event) => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const user_attributes = useSupabaseUserAttributes();
  const config = useRuntimeConfig();

  const tables = config.public.supabaseUserAttributes.tables;

  if (!user.value?.id) {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const table_alias = table.alias ?? table.name;
      user_attributes[table_alias].value = null;
    }
  } else {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const table_name = table.name;
      const table_alias = table.alias ?? table.name;
      const user_id_column = table.user_id_column ?? "id";

      const { data, error } = await client
        .from(table_name)
        .select("*")
        .eq(user_id_column, user.value?.id);

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
  }
});
