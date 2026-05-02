import { ref, watch, onScopeDispose } from 'vue';
import { useGameState } from '@/composables/useGameState';
import { useGameActions } from '@/composables/useGameActions';
import { GamePhase } from '@/types/round';
import { useRoomMetaStore } from '@/stores/roomMetaStore';

export const useGameFlow = () => {
  const {
    gamePhase,
    isActivePlayer,
    activePlayer,
    isCorrectAnswer,
    pointsAwarded,
  } = useGameState();

  const { awardPoints, setWinner, resetRound, setNextPlayer, resetGame } =
    useGameActions();
  const roomMetaStore = useRoomMetaStore();

  const showTipSelectionDialog = ref(false);
  const showResponseDialog = ref(false);
  const showWinnerDialog = ref(false);

  let timers: ReturnType<typeof setTimeout>[] = [];

  const scheduleTimer = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timers.push(id);
  };

  onScopeDispose(() => {
    timers.forEach(clearTimeout);
    timers = [];
  });

  const onEndResultPhase = async (isCurrentPlayerActive: boolean) => {
    showResponseDialog.value = false;

    if (isCurrentPlayerActive && isCorrectAnswer.value) {
      await awardPoints(activePlayer.value?.id ?? '', pointsAwarded.value);
      const currentPoints = activePlayer.value?.points ?? 0;

      if (currentPoints >= roomMetaStore.state.pointsToWin) {
        await setWinner();
      } else {
        await resetRound();
      }
    } else if (isCurrentPlayerActive) {
      await setNextPlayer();
    }
  };

  const onEndWinnerPhase = async (isCurrentPlayerActive: boolean) => {
    showWinnerDialog.value = false;

    if (isCurrentPlayerActive) {
      await resetGame();
    }
  };

  const phaseHandlers: Partial<Record<GamePhase, () => void>> = {
    [GamePhase.SelectingTip]: () => {
      if (isActivePlayer.value) {
        showTipSelectionDialog.value = true;
      }
    },
    [GamePhase.Result]: () => {
      showResponseDialog.value = true;
      const isCurrentPlayerActive = isActivePlayer.value;
      scheduleTimer(() => void onEndResultPhase(isCurrentPlayerActive), 3000);
    },
    [GamePhase.Winner]: () => {
      showWinnerDialog.value = true;
      const isCurrentPlayerActive = isActivePlayer.value;
      scheduleTimer(() => void onEndWinnerPhase(isCurrentPlayerActive), 5000);
    },
  };

  watch(
    gamePhase,
    (phase) => {
      phaseHandlers[phase]?.();
    },
    { immediate: true },
  );

  return {
    showTipSelectionDialog,
    showResponseDialog,
    showWinnerDialog,
  };
};
