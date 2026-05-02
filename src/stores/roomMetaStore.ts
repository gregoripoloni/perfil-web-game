import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RoomMeta } from '@/types/round';
import { DEFAULT_ROOM_META } from '@/types/round';

export const useRoomMetaStore = defineStore('roomMeta', () => {
  const state = ref<RoomMeta>({ ...DEFAULT_ROOM_META });

  const mergeState = (partial: Partial<RoomMeta>) => {
    state.value = { ...state.value, ...partial };
  };

  const $reset = () => {
    state.value = { ...DEFAULT_ROOM_META };
  };

  return { state, mergeState, $reset };
});
