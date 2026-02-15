import { Router } from "express";
import { transpositionKeys, transpositionIntervals } from "../services/theory/constants.js";

const router = Router();

const chromatic = [
  "C","C#","D","D#","E","F",
  "F#","G","G#","A","A#","B"
];

router.post("/", (req, res) => {
  const { notes, interval } = req.body;

  const transposed = notes.map(note => {
    const index = chromatic.indexOf(note);

    if (index === -1) return note;

    return chromatic[(index + interval) % 12];
  });

  res.json({ transposed });
});

export default router;