<script setup lang="ts">
  import Card from '../components/Card.vue';
</script>

<template>
  <div class="flex flex-col h-full p-2 gap-2 justify-center">
    <h1 class="text-6xl font-bold text-center mb-10 text-shadow-sm text-shadow-primary-400">Perfil Web Game</h1>
    <Card text="Criar uma sala" />
    <Card text="Entrar em uma sala" @click="$router.push('/game')" />
  </div>
</template>