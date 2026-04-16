<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Card from '../components/Card.vue';
  import RoomDialog from '../components/RoomDialog.vue';

  const router = useRouter();

  const isRoomDialogVisible = ref(false);

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const getRandomBlock = () =>
      Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${getRandomBlock()}-${getRandomBlock()}`;
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/game/${roomId}`)
  };
</script>

<template>
  <div class="flex flex-col h-full p-2 gap-2 justify-center">
    <h1 class="text-6xl font-bold text-center mb-10 text-shadow-sm text-shadow-primary-400">Perfil Web Game</h1>
    <Card text="Nova sala" @click="handleJoinRoom(generateRoomId())" />
    <Card text="Entrar em uma sala" @click="isRoomDialogVisible = true;" />
    <RoomDialog v-model:visible="isRoomDialogVisible" @join-room="handleJoinRoom" />
  </div>
</template>