import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Formatter,
  Accidental,
  Barline,
  StaveConnector
} from "vexflow";
import scales from "./../../scales.json";

export default function VexFlowSheet() {
  const containerRef = useRef(null);
  const octave = ["2", "3", "4", "5", "6"];
  const diatonicOrder = ["c", "d", "e", "f", "g", "a", "b"];
  const majorKeys = ["C#", "F#", "B", "E", "A", "D", "G", "C", "F",  "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
  const minorKeys = ["A#", "D#", "G#", "C#","F#","B", "E", "A", "D", "G",  "C", "F", "Bb", "Eb", "Ab"]
  const modeOperations = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
  const scaleTypes = ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"];
  const keySignatures = {
    "C": [],
    "G": ["f#"],
    "D": ["f#", "c#"],
    "A": ["f#", "c#", "g#"],
    "E": ["f#", "c#", "g#", "d#"],
    "B": ["f#", "c#", "g#", "d#", "a#"],
    "F#": ["f#", "c#", "g#", "d#", "a#", "e#"],
    "C#": ["f#", "c#", "g#", "d#", "a#", "e#", "b#"],

    "F": ["bb"],
    "Bb": ["bb", "eb"],
    "Eb": ["bb", "eb", "ab"],
    "Ab": ["bb", "eb", "ab", "db"],
    "Db": ["bb", "eb", "ab", "db", "gb"],
    "Gb": ["bb", "eb", "ab", "db", "gb", "cb"],
    "Cb": ["bb", "eb", "ab", "db", "gb", "cb", "fb"],
  };

  const keySignatureMap = {
    "C": {},
    "G": { "f": "#" },
    "D": { "f": "#", "c": "#" },
    "A": { "f": "#", "c": "#", "g": "#" },
    "E": { "f": "#", "c": "#", "g": "#", "d": "#" },
    "B": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#" },
    "F#": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#", "e": "#"},
    "C#": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#", "e": "#", "b": "#"},
    "F": { "b": "b" },
    "Bb": { "b": "b", "e": "b" },
    "Eb": { "b": "b", "e": "b", "a": "b" },
    "Ab": { "b": "b", "e": "b", "a": "b", "d": "b" },
    "Db": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b"},
    "Gb": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b", "c": "b"},
    "Cb": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b", "c": "b", "f": "b"}
  };

  // React state
  const [selectedScaleName, setSelectedScaleName] = useState("C Major");
  const [selectedTonic, setSelectedTonic] = useState("C");
  const [selectedScale, setSelectedScale] = useState("Major");
  const [selectedClef, setSelectedClef] = useState("treble");
  const [selectedMode, setSelectedMode] = useState("Ionian");
  const [showCourtesyAccidentals, setShowCourtesyAccidentals] = useState(true);
  const [showAllAccidentals, setShowAllAccidentals] = useState(false);

useEffect(() => {
  if (!containerRef.current) return;

  // --- Helpers ---
  const getNoteParts = (note) => {
    const match = note.match(/^([a-g])(bb|##|b|#)?$/i);
    return { letter: match[1].toLowerCase(), accidental: match[2] ?? null };
  };

  const accidentalToSymbol = (acc) => acc || "n";

  const needsAccidental = (note, key) => {
    const { letter, accidental } = getNoteParts(note);
    const keyAcc = keySignatures[key]?.find((k) => k[0].toLowerCase() === letter);
    if (!keyAcc && !accidental) return false;
    if (!keyAcc && accidental) return true;
    if (keyAcc && !accidental) return true;
    if (keyAcc && accidental) return keyAcc[1] !== accidental;
    return false;
  };

  // --- Ensure tonic is valid ---
  if (selectedScale === "Major" && !majorKeys.includes(selectedTonic)) setSelectedTonic("C");
  else if (selectedScale !== "Major" && !minorKeys.includes(selectedTonic)) setSelectedTonic("A");

  setSelectedScaleName(`${selectedTonic} ${selectedScale}`);

  const scaleName = `${selectedTonic} ${selectedScale}`;
  const foundScale = scales.find((s) => s.name === scaleName);
  if (!foundScale) return;

  const key = foundScale.key;
  const notes = [...foundScale.notes];

  // --- Apply mode for major scales ---
  let modeNotes = [...notes];
  if (selectedScale === "Major" && selectedMode !== "Ionian") {
    const shift = modeOperations.indexOf(selectedMode);
    if (shift > 0) modeNotes = [...notes.slice(shift), ...notes.slice(0, shift)];
  }

  // --- Split measures ---
  const firstMeasureNotesRaw = modeNotes.slice(0, 8);
  const secondMeasureNotesRaw = modeNotes.slice(-8);

  // --- Octave & diatonic tracking ---
  const octaveLevels = ["2", "3", "4", "5", "6"];
  let octaveIndex = selectedClef === "treble" ? 2 : 1;
  let lastPitchIndex = null;

  // --- First measure notes ---
  const firstMeasureNotes = firstMeasureNotesRaw.map((note) => {
    const base = note.split("/")[0];
    const pitchIndex = diatonicOrder.indexOf(base[0]);
    if (lastPitchIndex !== null && lastPitchIndex > pitchIndex) octaveIndex++;
    lastPitchIndex = pitchIndex;
    return `${base}/${octaveLevels[octaveIndex]}`;
  });

  const firstMeasureAccidentals = firstMeasureNotesRaw.map((note) => {
    const base = note.split("/")[0];
    if (showAllAccidentals) return accidentalToSymbol(getNoteParts(base).accidental ?? "n");
    if (needsAccidental(base, key)) return accidentalToSymbol(getNoteParts(base).accidental);
    return null;
  });

  // --- Second measure notes (descending) ---
  let descendingOctaveIndex = octaveIndex;
  let lastPitchIndexDesc = null;

  const secondMeasureNotes = secondMeasureNotesRaw.map((note) => {
    const base = note.split("/")[0];
    const pitchIndex = diatonicOrder.indexOf(base[0]);
    if (lastPitchIndexDesc !== null && lastPitchIndexDesc < pitchIndex) descendingOctaveIndex--;
    lastPitchIndexDesc = pitchIndex;
    return `${base}/${octaveLevels[descendingOctaveIndex]}`;
  });

  const secondMeasureAccidentals = secondMeasureNotes.map((note, i) => {
  const base = note.split("/")[0];
  const { accidental } = getNoteParts(base);

  // Show all accidentals
  if (showAllAccidentals) return { symbol: accidentalToSymbol(accidental ?? "n"), cautionary: false };

  // --- Harmonic Minor: 7th degree always shows its accidental ---
  if (selectedScale === "Harmonic Minor") {
    const harmonicMinorScale = scales.find(
      (s) => s.name === `${selectedTonic} Harmonic Minor`
    )?.notes;

    if (harmonicMinorScale) {
      const descendingIndex = secondMeasureNotes.length - 1 - i; // map to ascending scale
      if (descendingIndex === 6) { // 7th degree
        const targetNote = harmonicMinorScale[descendingIndex].split("/")[0];
        const { accidental: targetAcc } = getNoteParts(targetNote);
        return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: false };
      }
    }
  }

  // --- Melodic Minor descending courtesy: 7th and 6th degrees ---
  if (showCourtesyAccidentals && selectedScale === "Melodic Minor") {
    const naturalMinorScale = scales.find(
      (s) => s.name === `${selectedTonic} Natural Minor`
    )?.notes;

    if (naturalMinorScale) {
      const descendingIndex = secondMeasureNotes.length - 1 - i;
      if (descendingIndex === 6 || descendingIndex === 5) { // 7th and 6th
        const targetNote = naturalMinorScale[descendingIndex].split("/")[0];
        const { accidental: targetAcc } = getNoteParts(targetNote);
        return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: true };
      }
    }
  }

  // Otherwise, no accidental
  return { symbol: "", cautionary: false };
});

  // --- Render ---
  containerRef.current.innerHTML = "";
  const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
  renderer.resize(1000, 300);
  const context = renderer.getContext();

  // --- First stave ---
  const stave1 = new Stave(0, 40, 400);
  stave1.addClef(selectedClef).addKeySignature(key).setContext(context).draw();

  const notes1VF = firstMeasureNotes.map((n, i) => {
    const note = new StaveNote({ keys: [n], duration: "w", clef: selectedClef });
    const acc = firstMeasureAccidentals[i];
    if (acc) note.addModifier(new Accidental(acc), 0);
    return note;
  });

  // --- Second stave ---
  const stave2 = new Stave(400, 40, 400);
  stave2.setContext(context).setEndBarType(Barline.type.DOUBLE).draw();

  const notes2VF = secondMeasureNotes.map((n, i) => {
    const note = new StaveNote({ keys: [n], duration: "w", clef: selectedClef });

    // Ignore key signature for this note so accidentals work correctly
    note.ignoreKeySignature = true;

    const acc = secondMeasureAccidentals[i];

    if (acc && acc.symbol !== "") {
      const accidental = new Accidental(acc.symbol);
      if (acc.cautionary) accidental.setAsCautionary();
      note.addModifier(accidental, 0);
    }

    return note;
  });
  Formatter.FormatAndDraw(context, stave1, notes1VF);
  Formatter.FormatAndDraw(context, stave2, notes2VF);

  const connector = new StaveConnector(stave1, stave2);
  connector.setType(StaveConnector.type.SINGLE);
  connector.setContext(context);
  connector.draw();
}, [selectedTonic, selectedScale, selectedClef, selectedMode, showCourtesyAccidentals, showAllAccidentals]);


  return (
    <div style={{ width: "1000px", margin: "auto", padding: "20px" }}>
      {/* Dropdown to select scale */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Scale:{" "}
          <select
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            {scaleTypes.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Dropdown to select tonic */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Tonic:{" "}
          <select
            value={selectedTonic}
            onChange={(e) => setSelectedTonic(e.target.value)}
          >
          {selectedScale === "Major"
            ? majorKeys.map((tonic) => (
                <option key={tonic} value={tonic}>
                  {tonic}
                </option>
              ))
            : minorKeys.map((tonic) => (
                <option key={tonic} value={tonic}>
                  {tonic}
                </option>
              ))}
          </select>
        </label>
      </div>
      {/* Dropdown to select clef */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Clef:{" "}
          <select
            value={selectedClef}
            onChange={(e) => setSelectedClef(e.target.value)}
          >
              <option key={0} value={"treble"}>
                {"Treble"}
              </option>
              <option key={1} value={"bass"}>
                {"Bass"}
              </option>
          </select>
        </label>
      </div>
      {/* Dropdown to select major mode */}
      {selectedScale === "Major" && (
        <div style={{ marginBottom: "10px" }}>
          <label>
            Select Mode:{" "}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              {modeOperations.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {/* Checkbox for courtesy accidentals toggle */}
      {selectedScale === "Melodic Minor" && (
      <div style={{ marginBottom: "10px" }}>
        <label>
          Show Courtesy Accidentals {" "}
          <input
            type="checkbox"
            checked={showCourtesyAccidentals} // Bind the 'checked' attribute to the state value
            onChange={(e) => setShowCourtesyAccidentals(e.target.checked)} // Call the handler function on change
          />
        </label>
        {/* <p>Checkbox is currently: {showCourtesyAccidentals ? 'Checked' : 'Unchecked'}</p> */}
      </div>
      )}
      <div style={{ marginBottom: "10px" }}>
        {/* Checkbox for all accidentals toggle */}
        <label>
          Show All Accidentals {" "}
          <input
            type="checkbox"
            checked={showAllAccidentals} // Bind the 'checked' attribute to the state value
            onChange={(e) => setShowAllAccidentals(e.target.checked)} // Call the handler function on change
          />
        </label>
        {/* <p>Checkbox is currently: {showAllAccidentals ? 'Checked' : 'Unchecked'}</p> */}
      </div>
      {/* Display key and scale */}
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        {selectedScaleName}
      </div>
      {/* Render sheet music */}
      <div ref={containerRef} />
    </div>
  );
}