<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, Button } from 'primevue';
import { generateRoomId } from '@/utils/roomId';
import logoUrl from '@/assets/logo.png';

const router = useRouter();

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
            <div class="flex items-center justify-center gap-4">
              <span
                class="game-logo shrink-0 bg-primary-400"
                role="img"
                aria-label="Perfil Web"
                :style="{ '--logo-mask': `url('${logoUrl}')` }"
              />
              <h1
                class="text-6xl font-bold text-center text-border-primary-400"
              >
                Perfil
              </h1>
            </div>
            <p class="text-sm text-center">Versão 0.0.1</p>
            <p class="text-sm text-center lg:px-40">
              Perfil é um jogo de adivinhação de palavras que você pode jogar
              com seus amigos.
            </p>
          </div>
          <div class="flex justify-center">
            <Button
              icon="pi pi-play"
              label="Jogar"
              @click="handleJoinRoom(generateRoomId())"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.game-logo {
  display: inline-block;
  width: 4rem;
  height: 4rem;
  mask-image: var(--logo-mask);
  -webkit-mask-image: var(--logo-mask);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.Start:deep(> .p-card-body),
.Start:deep(> .p-card-body > .p-card-content) {
  height: 100%;
  overflow-y: auto;
}
</style>
