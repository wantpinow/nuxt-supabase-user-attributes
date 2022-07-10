import { useRuntimeConfig, useState } from "#app";

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
  return attributes;
};
