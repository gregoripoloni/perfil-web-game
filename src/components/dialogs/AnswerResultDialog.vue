<script setup lang="ts">
import MessageDialog from '@/components/ui/MessageDialog.vue';
import { useGameState } from '@/composables/useGameState';

const dialogVisible = defineModel<boolean>('visible');

defineProps<{
  response: string;
  isCorrect: boolean;
}>();

const { answeredBy, pointsAwarded } = useGameState();
</script>

<template>
  <MessageDialog
    v-model:visible="dialogVisible"
    :tone="isCorrect ? 'success' : 'error'"
    :main-text="response"
  >
    <template #header>
      Palpite de <span class="font-black">{{ answeredBy }}</span></template
    >
    <template #additional>
      <template v-if="isCorrect">
        A resposta está
        <span class="font-black">correta</span>
        <br />
        <span>
          {{ answeredBy }} ganha
          <span class="font-black">{{ pointsAwarded }}</span>
          pontos
        </span>
      </template>
      <template v-else>
        A resposta está
        <span class="font-black">incorreta</span>
      </template>
    </template>
  </MessageDialog>
</template>
