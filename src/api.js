import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  saveContract,
  writeContract,
  getContract,
  getAllContracts,
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
    const contract_id = await saveContract(src, state);
    res.json(contract_id);
  } catch (error) {
    console.log(error);
  }
});

app.post("/write", async (req, res) => {
  try {
    const { contract_id, input } = req.body;
    const tx = await writeContract(contract_id, input);
    res.json(tx);
  } catch (error) {
    console.log(error);
  }
});

app.get("/state/:contract_id", async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await getContract(contract_id);
    res.json(JSON.parse(contract.state));
  } catch (error) {
    console.log(error);
  }
});

app.get("/data/contract/:contract_id", async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await getContract(contract_id);
    res.json(contract);
  } catch (error) {
    console.log(error);
  }
});

app.get("/contracts", async (req, res) => {
  try {
    const contracts = await getAllContracts();
    res.json(contracts);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log("Server started"));