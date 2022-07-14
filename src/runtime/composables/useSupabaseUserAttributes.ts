import { useRuntimeConfig, useState } from "#app";
import {
  // @ts-ignore
  useSupabaseClient,
  // @ts-ignore
  useSupabaseUser,
} from "#imports";

export const useSupabaseUserAttributes = (): any => {
  const config = useRuntimeConfig();
  const tables = config.public.supabaseUserAttributes.tables;

  let attributes = {};
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const table_name = table.name;
    const table_alias = table.alias ?? table.name;
    attributes[table_alias] = useState(
      `_supabase_user_attributes_${table_name}`
    );
  }

  async function fetch() {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    if (!user.value?.id) {
      return;
    }
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const table_name = table.name;
      const table_alias = table.alias ?? table.name;
      const user_id_column = table.user_id_column ?? "id";

      const { data, error } = await client
        .from(table_name)
        .select("*")
        .eq(user_id_column, user.value.id);

      let value = null;
      if (!error) {
        if (table.multiple) {
          value = data;
        } else if (data.length == 1) {
          value = data[0];
        }
      }
      attributes[table_alias].value = value;
    }
  }

  async function reset() {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const table_alias = table.alias ?? table.name;
      attributes[table_alias].value = null;
    }
  }

  return { fetch, reset, ...attributes };
};
