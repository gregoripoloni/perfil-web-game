<script setup lang="ts">
  import { Card } from 'primevue';

  defineProps<{
    text: string;
    isDisabled?: boolean;
  }>();
</script>

<template>
  <Card
    class="transition-colors border-2"
    :class="{
      'bg-primary-400! border-primary-800' : isDisabled,
      'border-surface-800 hover:border-primary-400 cursor-pointer': !isDisabled
    }"
  >
    <template #content>
      <div class="flex items-center justify-center h-16">
        <Transition mode="out-in">
          <span
            class="text-xl font-black transition-colors"
            :class="{ 'text-surface-950': isDisabled }"
          >
            {{ text }}
          </span>
        </Transition>
      </div>
    </template>
  </Card>
</template>