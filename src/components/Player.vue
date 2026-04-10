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
  <div class="flex flex-col relative items-center justify-between p-2 rounded-xl border-2 border-surface-800 transition-colors lg:flex-row lg:gap-2">
    <Transition>
      <div
        v-if="isActive"
        class="absolute rounded-full bottom-full w-7 h-[2px] lg:bottom-auto lg:right-full lg:w-[2px] lg:h-7"
        :class="isCurrentPlayer ? 'bg-sky-400' : 'bg-primary-400'"
      />
    </Transition>
    <div class="flex flex-col items-center gap-2 w-full overflow-x-hidden lg:flex-row">
      <div
        class="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-surface-400"
        :class="isCurrentPlayer ? 'bg-sky-400!' : ''"
      >
        <span class="text-xl font-semibold text-surface-950">
          {{ letter }}
        </span>
      </div>
      <span
        class="text-sm text-left max-w-full overflow-x-hidden text-nowrap text-ellipsis"
        :class="isCurrentPlayer ? 'text-sky-400' : ''"
      >
        {{ name }}
      </span>
    </div>
    <span
      class="text-lg font-semibold"
      :class="isCurrentPlayer ? 'text-sky-400' : ''"
    >
      {{ points }}
    </span>
  </div>
</template>