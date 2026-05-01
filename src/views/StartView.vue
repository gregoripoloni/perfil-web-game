<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Card } from 'primevue';
  import SelectableCard from '@/components/ui/SelectableCard.vue';
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
    <Card class="Start h-full col-span-3 overflow-y-auto bg-surface-950! border-2 border-surface-800">
      <template #content>
        <div class="flex flex-col h-full p-2 gap-2 justify-between">
          <div class="flex items-center justify-center h-full">
            <h1 class="text-6xl font-bold text-center text-shadow-sm text-shadow-primary-400">
              Perfil
              <br />
              <span class="text-4xl">Versão Web</span>
            </h1>
          </div>
          <div class="flex flex-col gap-2">
            <SelectableCard text="Nova sala" @click="handleJoinRoom(generateRoomId())" />
            <SelectableCard text="Entrar em uma sala" @click="isRoomDialogVisible = true;" />
          </div>
          <JoinRoomDialog v-model:visible="isRoomDialogVisible" @join-room="handleJoinRoom" />
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
