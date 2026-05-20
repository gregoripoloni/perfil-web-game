<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  points: number;
  isActive?: boolean;
  isCurrentPlayer?: boolean;
}>();

const letter = computed(() => props.name.charAt(0));
</script>

<template>
  <div
    class="flex flex-col relative items-center justify-between p-2 pt-4 rounded-xl border-2 bg-surface-950 border-surface-800 transition-colors lg:flex-row lg:gap-2 lg:pt-2 lg:px-4"
  >
    <span
      v-if="isActive"
      class="pi pi-angle-down animate-bounce absolute top-0 left-1/2 -translate-x-1/2 text-sm! text-primary-400 lg:left-0 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:rotate-270"
    />
    <div
      class="flex flex-col items-center gap-2 w-full overflow-x-hidden lg:flex-row"
    >
      <div
        class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-surface-400"
        :class="{ 'bg-primary-400!': isCurrentPlayer }"
      >
        <span class="text-xl font-semibold text-surface-950">
          {{ letter }}
        </span>
      </div>
      <span
        class="text-sm text-left max-w-full overflow-x-hidden text-nowrap text-ellipsis"
        :class="{ 'text-primary-400': isCurrentPlayer }"
      >
        {{ name }}
      </span>
    </div>
    <span
      class="text-lg font-semibold"
      :class="{ 'text-primary-400': isCurrentPlayer }"
    >
      {{ points }}
    </span>
  </div>
</template>
