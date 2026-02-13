const router = require("express").Router();
const scales = require("../data/scales.json");

router.get("/", (req, res) => {
  res.json(scales);
});

module.exports = router;