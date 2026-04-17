<script setup lang="ts">
  import { ref } from 'vue';
  import { Dialog } from 'primevue';
  import { InputText } from 'primevue';
  import { Button } from 'primevue';
  import { useMultiplayer } from '../composables/useMultiplayer';

  const { joinGame } = useMultiplayer();

  const visible = ref(true);
  const username = ref('');

  const handleSave = () => {
    if (username.value.trim() === '') {
      return;
    }

    const name = username.value.trim().toLowerCase();
    joinGame(name);

    visible.value = false;
  };
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Nome" :closable="false" :style="{ width: '25rem', maxWidth: '90%' }">
    <div class="flex flex-col gap-4">
      <InputText
        class="flex-auto"
        v-model="username"
        placeholder="João"
        @keydown.prevent.enter="handleSave"
      />
      <Button type="button" label="Jogar" @click="handleSave" />
    </div>
  </Dialog>
</template>