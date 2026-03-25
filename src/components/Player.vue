<script setup lang="ts">
  defineProps<{
    name: string;
    points: number;
    isActive?: boolean;
  }>();
</script>

<template>
  <div class="flex flex-col items-center justify-between p-2 rounded-xl transition-colors lg:flex-row" :class="isActive ? 'bg-primary-950' : ''">
    <div class="flex flex-col items-center gap-2 lg:flex-row">
      <div class="w-8 h-8 rounded-lg bg-surface-700" :class="isActive ? 'bg-primary-400!' : ''"></div>
      <span class="text-sm text-left" :class="isActive ? 'text-primary-400' : ''">{{ name }}</span>
    </div>
    <span class="text-lg font-semibold" :class="isActive ? 'text-primary-400' : ''">{{ points }}</span>
  </div>
</template>