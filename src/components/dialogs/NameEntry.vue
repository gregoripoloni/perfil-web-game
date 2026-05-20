<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog, InputText, Button } from 'primevue';
import { useGameActions } from '@/composables/useGameActions';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlayersStore } from '@/stores/playersStore';

const { joinGame } = useGameActions();
const playerStore = usePlayerStore();
const playersStore = usePlayersStore();

const visible = computed(
  () => playersStore.loaded && !playerStore.player,
);
const username = ref('');
const loading = ref(false);

const handleSave = async () => {
  if (username.value.trim() === '') return;

  loading.value = true;
  const name = username.value.trim().toLowerCase();
  await joinGame(name);
  loading.value = false;
};
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Nome"
    :closable="false"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col gap-4">
      <InputText
        v-model="username"
        class="flex-auto"
        placeholder="João"
        @keydown.prevent.enter="handleSave"
      />
      <Button
        type="button"
        label="Jogar"
        :loading="loading"
        @click="handleSave"
      />
    </div>
  </Dialog>
</template>
