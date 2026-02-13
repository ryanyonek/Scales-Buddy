import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/scales", require("./routes/scales"));
app.use("/api/transpose", require("./routes/transpose"));
app.use("/api/export", require("./routes/export"));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});