<template>
  <form @submit.prevent="login(email, password)">
    <div>
      <input v-model="email" type="email" placeholder="email" />
    </div>
    <div>
      <input v-model="password" type="password" placeholder="password" />
    </div>
    <button type="submit">submit</button>
  </form>
</template>

<script setup>
const email = ref();
const password = ref();
const { login } = useSupabaseAuth();
</script>
