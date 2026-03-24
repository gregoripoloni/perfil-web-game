<script setup lang="ts">
  import { Card } from 'primevue';

  defineProps<{
    text: string;
    isOpen?: boolean;
    isDisabled?: boolean;
  }>();
</script>

<template>
  <Card class="group transition-colors relative" :class="{ 'bg-surface-0!': isOpen, 'hover:bg-primary-400! cursor-pointer': !isOpen && !isDisabled }">
    <template #content>
      <div class="flex items-center justify-center h-16">
        <Transition mode="out-in">
          <span v-if="!isOpen" class="text-xl text-surface-500 font-bold transition-colors" :class="{ 'group-hover:text-primary-50': !isDisabled }">
            {{ text }}
          </span>
          <span v-else class="text-xs text-surface-950 font-semibold">
            {{ text }}
          </span>
        </Transition>
      </div>
    </template>
  </Card>
</template>