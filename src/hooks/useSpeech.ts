import { useCallback, useEffect, useState } from "react";

let manifestCache: Record<string, string> | null = null;
let manifestLoaded = false;

async function loadManifest(): Promise<Record<string, string>> {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch("/audio/manifest.json");
    if (res.ok) {
      manifestCache = await res.json();
      return manifestCache!;
    }
  } catch {}
  return {};
}

export function useSpeech() {
  const [manifest, setManifest] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!manifestLoaded) {
      manifestLoaded = true;
      loadManifest().then(setManifest);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      const audioFile = manifest[text];
      if (audioFile) {
        // Use pre-generated Edge TTS audio
        const audio = new Audio(`/audio/${audioFile}`);
        audio.playbackRate = 0.9;
        audio.play().catch(() => {
          // Fallback to Web Speech API
          speakWithWebAPI(text);
        });
      } else {
        // Fallback to Web Speech API
        speakWithWebAPI(text);
      }
    },
    [manifest]
  );

  const isSupported =
    Object.keys(manifest).length > 0 || "speechSynthesis" in window;

  return { speak, isSupported };
}

function speakWithWebAPI(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.8;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find((v) => v.lang.startsWith("ja"));
  if (jaVoice) utterance.voice = jaVoice;
  window.speechSynthesis.speak(utterance);
}
