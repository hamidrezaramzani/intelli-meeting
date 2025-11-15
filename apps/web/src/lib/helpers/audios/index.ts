export const formatDuration = (minutesString: string) => {
  const minutes = Number(minutesString);
  const totalSeconds = Math.round(minutes * 60);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

export const formatProcessingDuration = (seconds: string) => {
  const h = Math.floor(Number(seconds) / 3600);
  const m = Math.floor((Number(seconds) % 3600) / 60);
  const s = Math.floor(Number(seconds) % 60);

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
};
