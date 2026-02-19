import { useRef } from "react";
import * as Tone from "tone";

export function useToneScaleAudio() {
  const synthRef = useRef(null);
  const partRef = useRef(null);

  function init() {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
  }

  async function play(notes, speed = 1, volume = 0) {
    await Tone.start();
    init();

    Tone.Transport.stop();
    Tone.Transport.cancel();

    synthRef.current.volume.value = volume;

    const noteDuration = "8n";

    partRef.current = new Tone.Part(
      (time, note) => {
        synthRef.current.triggerAttackRelease(note, noteDuration, time);
      },
      notes.map((note, index) => [
        index * (0.5 / speed),
        note
      ])
    ).start(0);

    Tone.Transport.start();
  }

  function stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  function setTempo(multiplier) {
    Tone.Transport.bpm.value = 120 * multiplier;
  }


  return { play, stop, setTempo };
}