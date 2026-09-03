const pad = (value: number) => String(value).padStart(2, '0');

export const formatClockDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
};
