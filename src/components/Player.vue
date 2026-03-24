<script setup lang="ts">
  defineProps<{
    name: string;
    points: number;
    isActive?: boolean;
  }>();
</script>

<template>
  <div class="flex items-center justify-between gap-2 p-2 rounded-xl transition-colors" :class="isActive ? 'bg-primary-950' : ''">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-surface-700" :class="isActive ? 'bg-primary-400!' : ''"></div>
      <span class="text-sm text-left" :class="isActive ? 'text-primary-400' : ''">{{ name }}</span>
    </div>
    <span class="text-lg font-semibold" :class="isActive ? 'text-primary-400' : ''">{{ points }} pts</span>
  </div>
</template>