import NodeCache from "node-cache";
import { guidGenerator } from "./mem-utils.js";
import { MEM_TESTNET_URL } from "./constants.js";
import axios from "axios";

const cache = new NodeCache();

export async function saveFunction(src, state) {
  try {
    const function_id = await guidGenerator();
    const func = { src, state };

    cache.set(function_id, func);

    return { function_id };
  } catch (error) {
    console.log(error);
    return { function_id: undefined };
  }
}

export async function writeFunction(function_id, input) {
  try {
    if (!cache.has(function_id)) {
      return { error: `${function_id} not deployed on testnet` };
    }

    const { src, state, exmContext } = cache.get(function_id);

    const body = {
      contractType: 0,
      initState: state,
      input: input,
      contractSrc: src,
      exmContext: exmContext ?? null,
    };

    const tx = await axios.post(MEM_TESTNET_URL, body);
    const newCntx = await updateExmCntx(function_id, tx.data.exmContext);

    cache.set(function_id, {
      src: src,
      state: JSON.stringify(tx.data.state),
      exmContext: JSON.stringify(tx.data.exmContext),
    });
    return tx.data;
  } catch (error) {
    console.log(error);
    return { state: "error" };
  }
}

async function updateExmCntx(function_id, newCntx) {
  try {
    const oldCntx = JSON.parse(cache.get(function_id)?.exmContext);

    for (const req in newCntx.requests) {
      oldCntx.requests[req] = newCntx.requests[req];
    }

    for (const v in newCntx.kv) {
      oldCntx.kv[v] = newCntx.kv[v];
    }

    return JSON.stringify(oldCntx);
  } catch (error) {
    console.log(error);
    return JSON.stringify(newCntx);
  }
}
export async function getFunction(function_id) {
  try {
    if (!cache.has(function_id)) {
      return { error: `${function_id} not deployed on testnet` };
    }

    const func = cache.get(function_id);
    return func;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllFunctions() {
  try {
    const functions = cache.keys();
    return functions;
  } catch (error) {
    return [];
  }
}
