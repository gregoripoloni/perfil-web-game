<script setup lang="ts">
  import { Card } from 'primevue';

  defineProps<{
    text: string;
    number: number;
  }>();
</script>

<template>
  <Card class="group transition-colors relative border-2 border-surface-800">
    <template #content>
      <div class="flex items-center gap-4 h-16 lg:gap-6">
        <span class="text-xl text-surface-600 font-black w-10 shrink-0">
          {{ number }}
        </span>
        <span class="text-sm text-surface-0 font-semibold">
          {{ text }}
        </span>
      </div>
    </template>
  </Card>
</template>