import { REFRESH_RATE } from 'appConstants';
import { getProgressStepInterval } from 'helpers';

export interface RoundTickerSnapshotType {
  elapsedMs: number;
  roundMs: number;
  stepMs: number;

  completedRounds: number;
}

type ListenerType = () => void;

const listeners = new Set<ListenerType>();

let roundMs = REFRESH_RATE;
let stepMs = getProgressStepInterval(REFRESH_RATE).toNumber();
let timer: ReturnType<typeof setInterval> | null = null;

let snapshot: RoundTickerSnapshotType = {
  elapsedMs: stepMs,
  roundMs,
  stepMs,
  completedRounds: 0
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const tick = () => {
  if (document.hidden) {
    return;
  }

  const hasCompletedRound = snapshot.elapsedMs >= roundMs;

  snapshot = {
    elapsedMs: hasCompletedRound ? stepMs : snapshot.elapsedMs + stepMs,
    roundMs,
    stepMs,
    completedRounds: hasCompletedRound
      ? snapshot.completedRounds + 1
      : snapshot.completedRounds
  };

  emit();
};

const startTimer = () => {
  if (timer !== null) {
    return;
  }
  timer = setInterval(tick, stepMs);
};

const stopTimer = () => {
  if (timer === null) {
    return;
  }
  clearInterval(timer);
  timer = null;
};

const restartTimer = () => {
  if (timer === null) {
    return;
  }
  stopTimer();
  startTimer();
};

export const roundTickerStore = {
  subscribe: (listener: ListenerType) => {
    listeners.add(listener);
    startTimer();

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        stopTimer();
      }
    };
  },

  getSnapshot: (): RoundTickerSnapshotType => snapshot,

  setRoundMs: (nextRoundMs: number) => {
    if (!nextRoundMs || nextRoundMs === roundMs) {
      return;
    }

    roundMs = nextRoundMs;
    stepMs = getProgressStepInterval(nextRoundMs).toNumber();

    snapshot = {
      elapsedMs: stepMs,
      roundMs,
      stepMs,
      completedRounds: snapshot.completedRounds
    };

    restartTimer();
    emit();
  },

  reset: () => {
    snapshot = {
      elapsedMs: stepMs,
      roundMs,
      stepMs,
      completedRounds: 0
    };

    restartTimer();
    emit();
  }
};
