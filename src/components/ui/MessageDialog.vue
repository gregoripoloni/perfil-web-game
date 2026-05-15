<script setup lang="ts">
import { computed, useSlots } from 'vue';

defineModel<boolean>('visible', { default: false });

const props = withDefaults(
  defineProps<{
    header?: string;
    mainText?: string;
    /** Plain-text footnote; use slot `#additional` for rich markup */
    additionalText?: string;
    tone?: 'success' | 'error' | 'warn' | 'neutral';
  }>(),
  { tone: 'neutral' },
);

const slots = useSlots();

const showAdditional = computed(
  () => !!(props.additionalText?.trim() || slots.additional?.()?.some(Boolean)),
);

const toneClass = computed(() => {
  const map = {
    success: 'text-lime-400',
    error: 'text-red-400',
    warn: 'text-amber-400',
    neutral: 'text-surface-400',
  } as const;
  return map[props.tone];
});

/** Tailwind default palette — radial glow follows message tone (success = lime-800) */
const panelToneStyle = computed(() => {
  const map = {
    success: 'var(--p-lime-800)',
    error: 'var(--p-red-800)',
    warn: 'var(--p-amber-800)',
    neutral: 'var(--p-surface-800)',
  } as const;
  return { '--message-dialog-tone': map[props.tone] } as Record<string, string>;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="message-dialog">
      <div
        v-if="visible"
        class="fixed inset-0 z-2000 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-(--p-surface-950)/75 backdrop-blur-xs"
          aria-hidden="true"
        />
        <div
          class="message-dialog-panel relative z-10 flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl px-6 py-10 text-center"
          :style="panelToneStyle"
        >
          <p
            v-if="$slots.header || header"
            class="text-base font-medium text-surface-0 tracking-wide"
          >
            <slot name="header">{{ header }}</slot>
          </p>
          <h1
            v-if="$slots.main || mainText"
            class="text-6xl font-bold leading-tight text-surface-0"
          >
            <slot name="main">{{ mainText }}</slot>
          </h1>
          <div
            v-if="showAdditional"
            class="text-base font-medium leading-relaxed"
            :class="toneClass"
          >
            <slot name="additional">{{ additionalText }}</slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.message-dialog-panel::before {
  content: '';
  position: absolute;
  top: 42%;
  left: 50%;
  z-index: 0;
  width: min(33rem, 132%);
  aspect-ratio: 1;
  border-radius: 50%;
  translate: -50% -50%;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--message-dialog-tone) 55%, transparent) 0%,
    color-mix(in srgb, var(--message-dialog-tone) 14%, transparent) 36%,
    transparent 58%
  );
}

.message-dialog-panel > * {
  position: relative;
  z-index: 1;
}

.message-dialog-enter-active,
.message-dialog-leave-active {
  transition: opacity 0.2s ease;
}

.message-dialog-enter-active .relative,
.message-dialog-leave-active .relative {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.message-dialog-enter-from,
.message-dialog-leave-to {
  opacity: 0;
}

.message-dialog-enter-from .relative,
.message-dialog-leave-to .relative {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
