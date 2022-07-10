import {
  // @ts-ignore
  useSupabaseClient,
} from "#imports";

const useSupabaseAuth = () => {
  const register = async (email, password, redirect = null) => {
    const supabase = useSupabaseClient();
    let { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (redirect) {
      await navigateTo(redirect);
    }
  };
  const login = async (email, password, redirect = null) => {
    const supabase = useSupabaseClient();
    let { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    if (redirect) {
      await navigateTo(redirect);
    }
  };
  const logout = async (redirect = null) => {
    const supabase = useSupabaseClient();
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    if (redirect) {
      await navigateTo(redirect);
    }
  };
  return { register, login, logout };
};
export default useSupabaseAuth;
