const express = require("express");
const app = express();

const logger = require("./middlewares/logger");
const catRouter = require("./routes/catRouter");
const goalRouter = require("./routes/goalRouter");
const locationRouter = require("./routes/locationRouter");
const waterintakeRouter = require("./routes/waterintakeRouter");

app.use(express.json());

app.use(logger);

app.use("/api/cats", catRouter);
app.use("/api/goals", goalRouter);
app.use("/api/locations", locationRouter);
app.use("/api/waterintakes", waterintakeRouter);
const PORT = 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
