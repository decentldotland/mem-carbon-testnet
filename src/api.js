import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  saveFunction,
  writeFunction,
  getFunction,
  getAllFunctions,
} from "./utils/cache.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: false,
  }),
);
app.use(bodyParser.json({ limit: "200mb" }));

app.use(function (req, res, next) {
  req.setTimeout(500000, function () {});
  next();
});

app.use(
  cors({
    origin: "*",
  }),
);

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "An internal server error occurred." });
});

app.post("/deploy", async (req, res) => {
  try {
    const { src, state } = req.body;
    const function_id = await saveFunction(src, state);
    res.json(function_id);
  } catch (error) {
    console.log(error);
  }
});

app.post("/write", async (req, res) => {
  try {
    const { function_id, input } = req.body;
    const tx = await writeFunction(function_id, input);
    res.json(tx);
  } catch (error) {
    console.log(error);
  }
});

app.get("/state/:function_id", async (req, res) => {
  try {
    const { function_id } = req.params;
    const func = await getFunction(function_id);
    res.json(JSON.parse(func.state));
  } catch (error) {
    console.log(error);
  }
});

app.get("/data/function/:function_id", async (req, res) => {
  try {
    const { function_id } = req.params;
    const func = await getFunction(function_id);
    res.json(func);
  } catch (error) {
    console.log(error);
  }
});

app.get("/functions", async (req, res) => {
  try {
    const functions = await getAllFunctions();
    res.json(functions);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log("Server started"));
