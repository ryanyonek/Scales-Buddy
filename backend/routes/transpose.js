router.post("/", (req, res) => {
  const { notes, interval } = req.body;

  // TODO: your transposition logic here
  const transposed = notes.map(note => note); 

  res.json({ transposed });
});