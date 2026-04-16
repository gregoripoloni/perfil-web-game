<script setup lang="ts">
  import { ref } from 'vue';
  import { Dialog } from 'primevue';
  import { InputText } from 'primevue';
  import { Button } from 'primevue';

  const visible = defineModel<boolean>();

  const emit = defineEmits<{
    (e: 'joinRoom', roomId: string): void;
  }>();

  const room = ref('');

  const handleJoin = () => {
    if (room.value.trim() === '') {
      return;
    }

    emit('joinRoom', room.value.trim().toLowerCase());

    visible.value = false;
  };
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Informe o código da sala" :style="{ width: '25rem', maxWidth: '90%' }">
    <div class="flex flex-col gap-4">
      <InputText class="flex-auto" v-model="room" @keydown.prevent.enter="handleJoin" />
      <Button type="button" label="Entrar" @click="handleJoin" />
    </div>
  </Dialog>
</template>