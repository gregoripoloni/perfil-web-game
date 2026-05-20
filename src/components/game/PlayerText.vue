<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
}>();

const letter = computed(() => props.name.charAt(0));
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <div
      class="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-surface-400"
    >
      <span class="text-base font-semibold text-surface-950">
        {{ letter }}
      </span>
    </div>
    <span class="text-base font-medium">
      {{ name }}
    </span>
  </div>
</template>
