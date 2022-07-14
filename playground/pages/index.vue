<template>
  <div>
    <button @click="resetUserAttributes">Reset manually!</button>
    <button @click="fetchUserAttributes">Fetch manually!</button>
  </div>
</template>

<script setup>
const { reset: resetUserAttributes, fetch: fetchUserAttributes } =
  useSupabaseUserAttributes();
</script>
