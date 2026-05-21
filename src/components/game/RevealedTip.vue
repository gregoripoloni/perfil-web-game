<script setup lang="ts">
import { computed } from 'vue';
import { Card } from 'primevue';
import { TipKind } from '@/types/round';

const props = defineProps<{
  text: string;
  number: number;
  kind?: TipKind;
}>();

const icon = computed(() => {
  if (props.kind === TipKind.GainPoints) return 'pi pi-arrow-up text-lime-400';
  if (props.kind === TipKind.LosePoints) return 'pi pi-arrow-down text-red-400';
  if (props.kind === TipKind.SkipTurn) return 'pi pi-forward text-amber-400';
  return 'pi pi-lightbulb text-primary-400';
});
</script>

<template>
  <Card class="group transition-colors relative border-2 border-surface-800">
    <template #content>
      <div class="flex items-center gap-4 h-16 lg:gap-6">
        <span class="text-xl text-surface-600 font-black w-10 shrink-0">
          {{ number }}
        </span>
        <span class="text-sm text-surface-0 font-semibold text-left flex-1">
          {{ text }}
        </span>
        <i v-if="icon" :class="icon" class="shrink-0" />
      </div>
    </template>
  </Card>
</template>
