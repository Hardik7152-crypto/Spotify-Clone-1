const seekbar = document.querySelector(".seekbar");
const progressEl = document.querySelector(".progress");
const circleEl = document.querySelector(".circle");
const songTimeEl = document.querySelector(".songtime");
let isSeeking = false;

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds) || seconds === Infinity) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const updateUI = (percent) => {
  const clamped = Math.max(0, Math.min(100, percent));
  progressEl.style.width = `${clamped}%`;
  circleEl.style.left = `${clamped}%`;
};

const seekToPosition = (clientX) => {
  const rect = seekbar.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
  if (currentsong.duration && !isNaN(currentsong.duration)) {
    currentsong.currentTime = (percent / 100) * currentsong.duration;
    updateUI(percent);
  }
};

seekbar.addEventListener("click", (e) => {
  seekToPosition(e.clientX);
});

circleEl.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  isSeeking = true;
  circleEl.setPointerCapture(e.pointerId);
});

circleEl.addEventListener("pointermove", (e) => {
  if (!isSeeking) return;
  seekToPosition(e.clientX);
});

window.addEventListener("pointerup", () => {
  if (isSeeking) {
    isSeeking = false;
  }
});

currentsong.addEventListener("loadedmetadata", () => {
  songTimeEl.textContent = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
});

currentsong.addEventListener("timeupdate", () => {
  if (!currentsong.duration || isSeeking) return;
  const progress = (currentsong.currentTime / currentsong.duration) * 100;
  updateUI(progress);
  songTimeEl.textContent = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
});

currentsong.addEventListener("ended", () => {
  updateUI(0);
  songTimeEl.textContent = "0:00 / 0:00";
});
