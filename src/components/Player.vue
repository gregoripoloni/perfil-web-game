<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    name: string;
    points: number;
    isActive?: boolean;
  }>();

  const letter = computed(() => props.name.charAt(0));
</script>

<template>
  <div
    class="flex flex-col items-center justify-between p-2 rounded-xl border-2 border-surface-800 transition-colors lg:flex-row lg:gap-2"
    :class="isActive ? 'bg-primary-950 border-primary-800!' : ''"
  >
    <div class="flex flex-col items-center gap-2 w-full overflow-x-hidden lg:flex-row">
      <div
        class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-surface-400"
        :class="isActive ? 'bg-primary-400!' : ''"
      >
        <span class="text-xl font-semibold text-surface-950">
          {{ letter }}
        </span>
      </div>
      <span
        class="text-sm text-left max-w-full overflow-x-hidden text-nowrap text-ellipsis"
        :class="isActive ? 'text-primary-400' : ''"
      >
        {{ name }}
      </span>
    </div>
    <span
      class="text-lg font-semibold"
      :class="isActive ? 'text-primary-400' : ''"
    >
      {{ points }}
    </span>
  </div>
</template>