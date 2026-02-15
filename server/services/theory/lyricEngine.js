import { scaleDegrees, majorSolfege, naturalMinorSolfege, harmonicMinorSolfege, melodicMinorSolfege } from "./constants.js"

export function buildLyrics({
  scale,
  mode,
  lyric,
  shift,
  showNoteLabels,
  directionMode,
  firstMeasureNotesRaw,
  secondMeasureNotesRaw
}) {    
    
    // --- Helper: Capitalize note names properly ---
    const capitalizeNoteName = (note) => {
      if (!note) {
        return "";
      }
      return note[0].toUpperCase() + note.slice(1); // keeps b/#/bb/## intact
    };

    let firstMeasureLyrics = [];
    let secondMeasureLyrics = [];

        // --- Split lyrics ---
    let baseLyrics = [];
    if (!showNoteLabels) {
      firstMeasureLyrics = [];
      secondMeasureLyrics = [];
    } else if (lyric === "Note Names") {
      firstMeasureLyrics = firstMeasureNotesRaw.map(capitalizeNoteName);
      secondMeasureLyrics = secondMeasureNotesRaw.map(capitalizeNoteName);
    } else if (lyric === "Scale Degrees") {
      baseLyrics = scaleDegrees.slice(0, 7);
      if (scale === "Major" && mode !== "Ionian") {
        baseLyrics = [...baseLyrics.slice(shift), ...baseLyrics.slice(0, shift)];
      } 
      firstMeasureLyrics = baseLyrics.slice(0,7);
      firstMeasureLyrics.push(firstMeasureLyrics[0]);
      secondMeasureLyrics = firstMeasureLyrics.slice(0,8).reverse();
    } else if (lyric === "Solfege") {
      const solfegeMap = {
        "Major": majorSolfege,
        "Natural Minor": naturalMinorSolfege,
        "Harmonic Minor": harmonicMinorSolfege,
        "Melodic Minor": melodicMinorSolfege,
      };
      baseLyrics = solfegeMap[scale].slice(0, 7);
      if (scale === "Major" && mode !== "Ionian") {
        baseLyrics = [...baseLyrics.slice(shift), ...baseLyrics.slice(0, shift)];
      } 
      firstMeasureLyrics = baseLyrics.slice(0,7);
      firstMeasureLyrics.push(firstMeasureLyrics[0]);
      if (scale === "Melodic Minor") {
        secondMeasureLyrics = solfegeMap[scale].slice(-8)
      } else {
        secondMeasureLyrics = firstMeasureLyrics.slice(0,8).reverse();
      }
    }

        // --- Apply direction mode ---
    if (directionMode === "ascending") {
      secondMeasureLyrics = [];
    }

    if (directionMode === "descending") {
      firstMeasureLyrics = []
    }

    return {
        firstMeasureLyrics,
        secondMeasureLyrics
    };
}