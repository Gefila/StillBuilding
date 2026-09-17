import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";
import {
  useAmbientAudioStore,
  type AmbientSoundId,
} from "../store/useAmbientAudioStore";

const SOUND_SOURCES: Record<Exclude<AmbientSoundId, "none">, number> = {
  rain: require("../../../assets/sounds/rain.wav"),
  whitenoise: require("../../../assets/sounds/whitenoise.wav"),
  cafe: require("../../../assets/sounds/cafe.wav"),
  waves: require("../../../assets/sounds/waves.wav"),
};

const CHIME_SOURCE: number = require("../../../assets/sounds/chime.wav");

class AmbientAudioService {
  private ambientPlayer: AudioPlayer | null = null;
  private chimePlayer: AudioPlayer | null = null;
  private currentSoundId: AmbientSoundId = "none";
  private isConfigured = false;

  private async ensureAudioMode() {
    if (this.isConfigured) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "mixWithOthers",
      });
      this.isConfigured = true;
    } catch (err) {
      console.warn("Failed to set audio mode for background playback:", err);
    }
  }

  async playAmbient(soundId?: AmbientSoundId, volume?: number) {
    const store = useAmbientAudioStore.getState();
    const targetSound = soundId ?? store.soundId;
    const targetVol = volume ?? store.volume;

    await this.ensureAudioMode();

    if (targetSound === "none") {
      this.pauseAmbient();
      store.setIsPlaying(false);
      return;
    }

    const source = SOUND_SOURCES[targetSound];
    if (!source) return;

    try {
      if (!this.ambientPlayer || this.currentSoundId !== targetSound) {
        if (this.ambientPlayer) {
          try {
            this.ambientPlayer.pause();
            this.ambientPlayer.remove();
          } catch {}
        }
        this.ambientPlayer = createAudioPlayer(source);
        this.currentSoundId = targetSound;
      }

      this.ambientPlayer.loop = true;
      this.ambientPlayer.volume = Math.max(0, Math.min(1, targetVol));
      this.ambientPlayer.play();
      store.setIsPlaying(true);
    } catch (err) {
      console.error("Failed to play ambient sound:", err);
      store.setIsPlaying(false);
    }
  }

  pauseAmbient() {
    const store = useAmbientAudioStore.getState();
    try {
      if (this.ambientPlayer && this.ambientPlayer.playing) {
        this.ambientPlayer.pause();
      }
    } catch (err) {
      console.warn("Error pausing ambient sound:", err);
    }
    store.setIsPlaying(false);
  }

  stopAmbient() {
    this.pauseAmbient();
    if (this.ambientPlayer) {
      try {
        this.ambientPlayer.seekTo(0);
      } catch {}
    }
  }

  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    useAmbientAudioStore.getState().setVolume(clamped);
    if (this.ambientPlayer) {
      try {
        this.ambientPlayer.volume = clamped;
      } catch (err) {
        console.warn("Failed to set ambient player volume:", err);
      }
    }
  }

  async playCompletionChime() {
    await this.ensureAudioMode();
    try {
      if (!this.chimePlayer) {
        this.chimePlayer = createAudioPlayer(CHIME_SOURCE);
      }
      this.chimePlayer.loop = false;
      this.chimePlayer.volume = 0.9;
      await this.chimePlayer.seekTo(0);
      this.chimePlayer.play();
    } catch (err) {
      console.warn("Failed to play completion chime:", err);
    }
  }
}

export const ambientAudioService = new AmbientAudioService();
