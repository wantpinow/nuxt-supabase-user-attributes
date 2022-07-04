export default defineNuxtPlugin(async () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const user_attributes = useSupabaseUserAttributes();
  const config = useRuntimeConfig();
  const tables = config.public.supabaseUserAttributesTables;

  if (!user.value?.id) {
    for (let i = 0; i < Object.keys(tables).length; i++) {
      const table_name = Object.keys(tables)[i];
      const table_alias = tables[table_name];
      user_attributes[table_alias].value = null;
    }
  } else {
    for (let i = 0; i < Object.keys(tables).length; i++) {
      const table_name = Object.keys(tables)[i];
      const table_alias = tables[table_name];
      const { data, error } = await client
        .from(table_name)
        .select("*")
        .eq("id", user.value?.id)
        .limit(1);
      if (error || data.length != 1) {
        user_attributes[table_alias].value = null;
      } else {
        user_attributes[table_alias].value = data[0];
      }
    }
  }
});
