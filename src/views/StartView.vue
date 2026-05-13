<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Button } from 'primevue';
import JoinRoomDialog from '@/components/dialogs/JoinRoomDialog.vue';
import { generateRoomId } from '@/utils/roomId';

const router = useRouter();

const isRoomDialogVisible = ref(false);

const handleJoinRoom = (roomId: string) => {
  router.push(`/game/${roomId}`);
};
</script>

<template>
  <div class="h-full p-2">
    <Card
      class="Start h-full col-span-3 overflow-y-auto bg-surface-950! border-2 border-surface-800"
    >
      <template #content>
        <div class="flex flex-col h-full p-2 gap-2 justify-between">
          <div class="flex flex-col gap-8 items-center justify-center h-full">
            <h1
              class="text-6xl font-bold text-center text-shadow-sm text-shadow-primary-400"
            >
              Perfil Web
            </h1>
            <p class="text-sm text-center">Versão 0.0.1</p>
            <p class="text-sm text-center lg:px-40">
              Perfil Web é um jogo de adivinhação de palavras que você pode
              jogar com seus amigos.
            </p>
          </div>
          <div class="flex justify-center">
            <Button
              icon="pi pi-play"
              label="Jogar"
              @click="handleJoinRoom(generateRoomId())"
            />
          </div>
          <JoinRoomDialog
            v-model:visible="isRoomDialogVisible"
            @join-room="handleJoinRoom"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.Start:deep(> .p-card-body),
.Start:deep(> .p-card-body > .p-card-content) {
  height: 100%;
  overflow-y: auto;
}
</style>
