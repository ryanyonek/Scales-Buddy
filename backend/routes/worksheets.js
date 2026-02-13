router.post("/worksheet", async (req, res) => {
  const { scales } = req.body;

  // generate output file later
  res.json({ status: "Export queued" });
});