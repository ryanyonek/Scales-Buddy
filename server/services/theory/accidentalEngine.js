import scales from "../../data/scales.json" with { type: "json" };
import { keySignatures } from "./constants.js";
export function buildAccidentals({
  scale,
  tonic,
  key,
  showAllAccidentals,
  showCourtesyAccidentals,
  firstMeasureNotesRaw,
  secondMeasureNotes
}) {

    const getNoteParts = (note) => {
        const base = note.split("/")[0];
        const match = base.match(/^([a-g])(bb|##|b|#)?$/i);
        if (!match) {
        return { letter: null, accidental: null };
        }

        return {
        letter: match[1].toLowerCase(),
        accidental: match[2] ?? null,
        };
    };
    const accidentalToSymbol = (acc) => acc || "n";

    const needsAccidental = (note, key) => {
      const { letter, accidental } = getNoteParts(note);
      if (!letter) {
        return false;
      }

      const keyAccList = keySignatures[key] ?? [];
      const keyAcc = keyAccList.find(
        (k) => k[0].toLowerCase() === letter
      );

      if (!keyAcc && !accidental) {
        return false;
      } 
      if (!keyAcc && accidental) {
        return true;
      }
      if (keyAcc && !accidental) {
        return true;
      }
      if (keyAcc && accidental) {
        return keyAcc[1] !== accidental;
      }
      return false;
    };

  // - accidental logic

    // --- Accidentals for first measure ---
    const firstMeasureAccidentals = firstMeasureNotesRaw.map((note) => {
      const base = note.split("/")[0];
      if (showAllAccidentals) {
        return accidentalToSymbol(getNoteParts(base).accidental ?? "n");
      }
      if (needsAccidental(base, key)) {
        return accidentalToSymbol(getNoteParts(base).accidental);
      } 
      return null;
    });

    // --- Accidentals for second measure ---
    const secondMeasureAccidentals = secondMeasureNotes.map((note, i) => {
      const base = note.split("/")[0];
      const { accidental } = getNoteParts(base);

      if (scale === "Harmonic Minor") {
        const harmonicMinorScale = scales.find(
          (s) => s.name === `${tonic} Harmonic Minor`
        )?.notes;
        if (harmonicMinorScale) {
          const descendingIndex = secondMeasureNotes.length - 1 - i;
          if (descendingIndex === 6) {
            const targetNote = harmonicMinorScale[descendingIndex].split("/")[0];
            const { accidental: targetAcc } = getNoteParts(targetNote);
            return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: false };
          }
        }
      }

      if (scale === "Melodic Minor") {
        const naturalMinorScale = scales.find(
          (s) => s.name === `${tonic} Natural Minor`
        )?.notes;
        if (naturalMinorScale) {
          const descendingIndex = secondMeasureNotes.length - 1 - i;
          if (descendingIndex === 6 || descendingIndex === 5) {
            const targetNote = naturalMinorScale[descendingIndex].split("/")[0];
            const { accidental: targetAcc } = getNoteParts(targetNote);
            if (showCourtesyAccidentals) {
              return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: true };
            } else if (showAllAccidentals) {
              return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: false };
            }
          }
        }
      } 

      if (showAllAccidentals) {
        return { symbol: accidentalToSymbol(accidental ?? "n"), cautionary: false };
      }

      return { symbol: "", cautionary: false };
    });

    return {
        firstMeasureAccidentals,
        secondMeasureAccidentals
    };
}