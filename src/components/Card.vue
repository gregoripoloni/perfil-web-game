<script setup lang="ts">
  import { Card } from 'primevue';

  defineProps<{
    text: string;
    isOpen?: boolean;
    isDisabled?: boolean;
  }>();
</script>

<template>
  <Card
    class="group transition-colors relative border-2 border-surface-800"
    :class="{
      'bg-surface-0! border-surface-300!': isOpen,
      'hover:border-primary-400 cursor-pointer': !isOpen && !isDisabled
    }"
  >
    <template #content>
      <div class="flex items-center justify-center h-16">
        <Transition mode="out-in">
          <span
            v-if="!isOpen"
            class="text-xl text-surface-500 font-black transition-colors"
            :class="{ 'group-hover:text-primary-400': !isDisabled }"
          >
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