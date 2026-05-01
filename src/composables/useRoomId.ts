import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { RoomId } from '../types/multiplayer';

export const useRoomId = () => {
  const route = useRoute();
  const roomId = computed(() => route.params.id as RoomId);
  return { roomId };
};
