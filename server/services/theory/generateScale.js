import { buildScaleData } from "./scaleEngine.js";
import { buildLyrics } from "./lyricEngine.js";
import { buildAccidentals } from "./accidentalEngine.js";

export function generateScale(config) {

  const scaleData = buildScaleData(config);

  if (!scaleData) return null;

  const lyrics = buildLyrics({ ...config, ...scaleData });
  const accidentals = buildAccidentals({ ...config, ...scaleData });

  return {
    key: scaleData.key,
    firstMeasure: {
      notes: scaleData.firstMeasureNotes,
      lyrics: lyrics.firstMeasureLyrics,
      accidentals: accidentals.firstMeasureAccidentals
    },
    secondMeasure: {
      notes: scaleData.secondMeasureNotes,
      lyrics: lyrics.secondMeasureLyrics,
      accidentals: accidentals.secondMeasureAccidentals
    }
  };
}