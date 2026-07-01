<script setup lang="ts">
defineProps<{
  guesses: string[];
}>();
</script>

<template>
  <div v-if="guesses.length" class="flex flex-col gap-2">
    <span class="text-sm font-semibold text-surface-400">
      Palpites já tentados
    </span>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(guess, index) in guesses"
        :key="`${guess}-${index}`"
        class="px-3 py-1 rounded-lg text-sm font-medium uppercase bg-surface-900 border border-surface-700 text-surface-300"
      >
        {{ guess }}
      </span>
    </div>
  </div>
</template>
