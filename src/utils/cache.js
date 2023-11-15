import NodeCache from "node-cache";
import { guidGenerator } from "./mem-utils.js";
import { MEM_TESTNET_URL } from "./constants.js";
import axios from "axios";

const cache = new NodeCache();

export async function saveContract(src, state) {
  try {
    const contract_id = await guidGenerator();
    const contract = { src, state };

    cache.set(contract_id, contract);

    return { contract_id };
  } catch (error) {
    console.log(error);
    return { contract_id: undefined };
  }
}

export async function writeContract(contract_id, input) {
  try {
    if (!cache.has(contract_id)) {
      return { error: `${contract_id} not deployed on testnet` };
    }

    const { src, state, exmContext } = cache.get(contract_id);

    const body = {
      contractType: 0,
      initState: state,
      input: input,
      contractSrc: src,
      exmContext: exmContext ?? null,
    };

    const tx = await axios.post(MEM_TESTNET_URL, body);
    const newCntx = await updateExmCntx(contract_id, tx.data.exmContext);

    cache.set(contract_id, {
      src: src,
      state: JSON.stringify(tx.data.state),
      exmContext: newCntx,
    });
    return tx.data;
  } catch (error) {
    console.log(error);
    return { state: "error" };
  }
}

async function updateExmCntx(contract_id, newCntx) {
  try {
    const oldCntx = JSON.parse(cache.get(contract_id)?.exmContext);

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
export async function getContract(contract_id) {
  try {
    if (!cache.has(contract_id)) {
      return { error: `${contract_id} not deployed on testnet` };
    }

    const contract = cache.get(contract_id);
    return contract;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllContracts() {
  try {
    const contracts = cache.keys();
    return contracts;
  } catch (error) {
    return [];
  }
}
