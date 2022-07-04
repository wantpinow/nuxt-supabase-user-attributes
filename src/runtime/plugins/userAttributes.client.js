export default defineNuxtPlugin(async (nuxtApp) => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const user_attributes = useSupabaseUserAttributes();
  const config = useRuntimeConfig();
  const tables = config.public.supabaseUserAttributesTables;

  nuxtApp.hooks.hook("app:mounted", () => {
    client.auth.onAuthStateChange(async (event, session) => {
      if (event == "SIGNED_IN") {
        for (let i = 0; i < Object.keys(tables).length; i++) {
          const table_name = Object.keys(tables)[i];
          const table_alias = tables[table_name];
          const { data, error } = await client
            .from(table_name)
            .select("*")
            .eq("id", session.user.id)
            .limit(1);
          if (error || data.length != 1) {
            user_attributes[table_alias].value = null;
          } else {
            user_attributes[table_alias].value = data[0];
          }
        }
      } else if (event == "SIGNED_OUT") {
        for (let i = 0; i < Object.keys(tables).length; i++) {
          const table_name = Object.keys(tables)[i];
          const table_alias = tables[table_name];
          user_attributes[table_alias].value = null;
        }
      }
    });
  });
});
