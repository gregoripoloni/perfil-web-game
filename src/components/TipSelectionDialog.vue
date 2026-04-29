<script setup lang="ts">
  import { Dialog } from 'primevue';
  import Card from './Card.vue';
  import { useGame } from '../composables/useGame';

  defineProps<{
    isVisible: boolean;
  }>();

  defineEmits<{
    (e: 'selectTip', id: number): void;
  }>();

  const { currentTips } = useGame();
</script>

<template>
  <Dialog :visible="isVisible" modal header="Selecione uma dica" :closable="false" :style="{ width: '50rem' }">
    <div class="grid grid-cols-2 gap-2 p-2 max-h-full overflow-y-auto lg:grid-cols-4">
      <Card
        v-for="(tip, index) in currentTips"
        :key="tip.text"
        :text="`${index + 1}`"
        :isDisabled="tip.isOpen"
        class="col-span-1"
        @click="$emit('selectTip', tip.id)"
      />
    </div>
  </Dialog>
</template>