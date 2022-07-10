<template>
  <div>
    {{ user?.email || "not logged in" }}
    <button v-if="user" @click="logout()">logout</button>
    <a v-else href="/login">login</a>
    {{ metadata }}
    {{ profile }}
  </div>
</template>
<script setup>
const user = useSupabaseUser();
const { logout } = useSupabaseAuth();

const { profile, metadata } = useSupabaseUserAttributes();
</script>
