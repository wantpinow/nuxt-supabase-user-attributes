<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="() => register(email, password, '/')">
      <div>
        <input v-model="email" type="email" placeholder="email" />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="password" />
      </div>
      <button type="submit">submit</button>
    </form>
  </div>
</template>

<script setup>
const email = ref();
const password = ref();
const { register } = useSupabaseAuth();
</script>
