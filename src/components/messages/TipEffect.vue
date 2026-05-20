<script setup lang="ts">
import PlayerText from '@/components/game/PlayerText.vue';
import RevealedTip from '@/components/game/RevealedTip.vue';
import { useGameState } from '@/composables/useGameState';

const { activePlayer, latestRevealedTip } = useGameState();
</script>

<template>
  <div
    class="flex flex-col items-start m-auto gap-2 rounded-2xl h-full px-6 py-10"
  >
    <PlayerText :name="activePlayer?.name ?? ''" />
    <RevealedTip
      :text="latestRevealedTip?.text ?? ''"
      :number="latestRevealedTip?.number ?? 0"
      :kind="latestRevealedTip?.kind"
    />
  </div>
</template>
