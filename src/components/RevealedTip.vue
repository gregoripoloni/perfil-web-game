<script setup lang="ts">
  import { Card } from 'primevue';

  defineProps<{
    text: string;
  }>();
</script>

<template>
  <Card class="group transition-colors relative border-2 border-surface-800">
    <template #content>
      <div class="flex items-center justify-center h-16">
        <span class="text-sm text-surface-0 font-semibold">
          {{ text }}
        </span>
      </div>
    </template>
  </Card>
</template>