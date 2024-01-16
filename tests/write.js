import axios from "axios";

const TESTNET_ENDPOINT = "https://mem-testnet.xyz/write";

async function write(function_id) {
  try {
    const input = '{"function": "save", "username": "hello", "data": "world"}';

    const body = {
      input,
      function_id,
    };
    const result = (await axios.post(TESTNET_ENDPOINT, body))?.data;
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

const FUNCTION_ID = "..."
write(FUNCTION_ID);