import { useEffect } from "react";
import { useScaleState } from "../../hooks/useScaleState";
import { scaleTypes, majorKeys, minorKeys, modeShifts, transpositionIntervals } from "../../utils/musicTheory"
import VexFlowRenderer from "./VexFlowRenderer";
import ScaleSelect from "../controls/ScaleSelect";
import ClefSelect from "../controls/ClefSelect";
import AllAccidentalsToggle from "../controls/AllAccidentalsToggle";
import CourtesyAccidentalsToggle from "../controls/CourtesyAccidentalsToggle";
import DirectionSelect from "../controls/DirectionSelect";
import ModeSelect from "../controls/ModeSelect";
import LyricsSelect from "../controls/LyricsSelect";
import NoteLabelsToggle from "../controls/NoteLabelsToggle";
import TonicSelect from "../controls/TonicSelect";
import ScaleNameDisplay from "../ui/ScaleNameDisplay";
import TranspositionSelect from "../controls/transpositionSelect";
import OctaveSelect from "../controls/OctaveSelect";

export default function VexFlowSheet(props) {
  const state = useScaleState();

  const [selectedScale, setSelectedScale] = state.selectedScale;
  const [selectedClef, setSelectedClef] = state.selectedClef;
  const [showAllAccidentals, setShowAllAccidentals] = state.showAllAccidentals;
  const [showCourtesyAccidentals, setShowCourtesyAccidentals] = state.showCourtesyAccidentals;
  const [directionMode, setDirectionMode] = state.directionMode;
  const [selectedMode, setSelectedMode] = state.selectedMode;
  const [showNoteLabels, setShowNoteLabels] = state.showNoteLabels;
  const [selectedLyric, setSelectedLyric] = state.selectedLyric;
  const [octaveShift, setOctaveShift] = state.octaveShift;
  const [selectedTonic, setSelectedTonic] = state.selectedTonic;
  const [transpositionInterval, setTranspositionInterval] = state.transpositionInterval;

useEffect(() => {
  if (selectedScale === "Major" && !majorKeys.includes(selectedTonic)) {
    setSelectedTonic("C");
  } else if (selectedScale !== "Major" && !minorKeys.includes(selectedTonic)) {
    setSelectedTonic("A");
  }
}, [selectedScale, selectedTonic]);

  return (
    <div className="app-container">
      {props.mode === "original" && (
      <div className="control-wrapper">
      
        <div className="control-panel">
          <TonicSelect 
            value={selectedTonic}
            onChange={setSelectedTonic}
            majorKeys={majorKeys}
            minorKeys={minorKeys}
            selectedScale={selectedScale}
          />
        
          <ScaleSelect
            value={selectedScale}
            onChange={setSelectedScale}
            scaleTypes={scaleTypes}
          />

          <ClefSelect
            value={selectedClef}
            onChange={setSelectedClef}
          />

          {selectedScale === "Major" && (
            <ModeSelect 
              value={selectedMode}
              onChange={setSelectedMode}
              modeShifts={modeShifts}
            />
          )}
        </div>

        <div className="control-panel">
          <AllAccidentalsToggle 
            value={showAllAccidentals}
            onChange={setShowAllAccidentals}
          />

          {selectedScale === "Melodic Minor" && (
            <CourtesyAccidentalsToggle 
              value={showCourtesyAccidentals}
              onChange={setShowCourtesyAccidentals}
            />
          )}
        </div>

        <div className="control-panel">
          <NoteLabelsToggle 
            value={showNoteLabels}
            onChange={setShowNoteLabels}
          />

          {showNoteLabels && (
            <LyricsSelect
              value={selectedLyric}
              onChange={setSelectedLyric}
            />
          )}

        </div>
        <div className="control-panel">
          <DirectionSelect
            value={directionMode}
            onChange={setDirectionMode}
          />

          <OctaveSelect 
            value={octaveShift}
            onChange={setOctaveShift}
          />
        </div>
        
      </div> )}

      {props.mode === "transpose" && (
        <TranspositionSelect 
        value={transpositionInterval}
        onChange={setTranspositionInterval}
        intervals={transpositionIntervals}
      />)}

      <div className="scale-name-wrapper">
        <ScaleNameDisplay 
          selectedScale={selectedScale}
          selectedTonic={selectedTonic}
          selectedMode={selectedMode}
        />
      </div>
        <VexFlowRenderer
          selectedTonic={selectedTonic}
          selectedScale={selectedScale}
          selectedClef={selectedClef}
          showAllAccidentals={showAllAccidentals}
          showCourtesyAccidentals={showCourtesyAccidentals}
          directionMode={directionMode}
          selectedMode={selectedMode}
          showNoteLabels={showNoteLabels}
          selectedLyric={selectedLyric}
          octaveShift={octaveShift}
        />

    </div>
  );
}