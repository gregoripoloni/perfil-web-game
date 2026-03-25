<script setup lang="ts">
  import { ref } from 'vue';
  import { Dialog } from 'primevue';
  import { InputText } from 'primevue';
  import { Button } from 'primevue';
  import { usePlayerStore } from '../stores/playerStore';
  import { useMultiplayerGame } from '../composables/useMultiplayer';

  const playerStore = usePlayerStore();
  const multiplayer = useMultiplayerGame();

  const visible = ref(true);
  const username = ref('');

  const handleSave = () => {
    if (username.value.trim() === '') {
      return;
    }

    const name = username.value.trim().toLowerCase();

    multiplayer.joinGame(name);
    playerStore.setPlayer(multiplayer.clientId, name);

    visible.value = false;
  };
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Informe seu nome" :closable="false" :style="{ width: '25rem', maxWidth: '90%' }">
    <div class="flex flex-col gap-4">
      <InputText id="username" class="flex-auto" autocomplete="off" v-model="username" @keydown.prevent.enter="handleSave" />
      <Button type="button" label="Jogar" @click="handleSave" />
    </div>
  </Dialog>
</template>