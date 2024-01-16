import axios from "axios";

const TESTNET_ENDPOINT = "https://mem-testnet.xyz/deploy";


const sourceCode = `export async function handle(state, action) {
  const input = action.input;

  if (input.function === "save") {
    const { username, data } = input;
    ContractAssert(
      username.trim().length && data.trim().length,
      "ERROR_INVALID_INPUT",
    );
    ContractAssert(typeof username === "string" && typeof data === "string");
    state.logs.push({ username, data });
    return { state };
  }
}
`;

const initState = `{"logs": []}`;



async function deploy() {
  try {
    const body = {
      src: sourceCode,
      state: initState,
    };
    
    const function_id = (await axios.post(TESTNET_ENDPOINT, body))?.data
      ?.function_id;
    console.log(`function id: ${function_id}`);
    console.log(`check it on https://mem-testnet.xyz/state/${function_id}`)
    return function_id;
  } catch (error) {
    console.log(error);
  }
}

deploy();

