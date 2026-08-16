const STORAGE_KEY = "quince-admin-order-sound";

let audio: HTMLAudioElement | null = null;

export function isOrderSoundEnabled() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function setOrderSoundEnabled(enabled: boolean) {
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new Event("quince:order-sound"));
}

function getAudio() {
  if (!audio) {
    audio = new Audio("/sounds/chaching.wav");
    audio.preload = "auto";
    audio.volume = 1;
  }
  return audio;
}

export async function playOrderSound() {
  const el = getAudio();
  el.pause();
  el.currentTime = 0;
  await el.play();
}

export async function enableOrderSound() {
  setOrderSoundEnabled(true);
  await playOrderSound();
}

export function disableOrderSound() {
  setOrderSoundEnabled(false);
}
