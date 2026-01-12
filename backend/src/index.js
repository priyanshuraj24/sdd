const express = require("express");
const cors = require("cors");
const app = express();
const connectDb = require("./dbConnect");
connectDb();

const PROT = process.env.PROT || 5000;
app.use(express.json());
app.use(cors());
app.use("/project", require("./routes/createProject"));
app.use("/tasks", require("./routes/tasks"));

app.listen(PROT, () => {
  console.log(`Server started on PORT ${PROT}`);
});
