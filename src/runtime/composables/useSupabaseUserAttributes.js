const useSupabaseUserAttributes = () => {
  const config = useRuntimeConfig();
  const tables = config.public.supabaseUserAttributesTables;
  let attributes = {};
  Object.keys(tables).forEach((table_name) => {
    const table_alias = tables[table_name];
    attributes[table_alias] = useState(
      `_supabase_user_attributes_${table_name}`
    );
  });
  return attributes;
};
export default useSupabaseUserAttributes;
