<p align="center">
  <a href="https://mem.tech">
    <img src="https://mem-home.vercel.app/icons/mem/mem-logo-v2.svg" height="180">
  </a>
  <h3 align="center"><code>@decentldotland/mem-carbon-testnet</code></h3>
  <p align="center">MEM Carbon is a testnet network with temporal states storage</p>
</p>



## Build & Run Locally

```bash

git pull https://github.com/decentldotland/mem-carbon-testnet.git

npm install && npm run start

```

## Self Hosted Vs Served Endpoint

To safeguard the confidentiality of your tests and environmental agreements, it's recommended to operate a local testnet instance. This not only enhances scalability and testing speed but also maintains privacy.

Nevertheless, the MEM team provides a publicly accessible endpoint. It's crucial to note that the testnet data is strictly temporary and is purged within a 1-2 day timeframe:

- Base endpoint: https://mem-testnet.xyz


## Testnet Methods

### Deploy a function

- `POST /deploy`


```js

const TESTNET_ENDPOINT = "https://endpoint.something/deploy";

async function deploy() {
  try {
    const sourceCode = readFileSync("./func.js", { encoding: "utf8" }); // the src code of the function
    const initState = readFileSync("./state.json", { encoding: "utf8" }); // the JSON initial function state
    
    const body = {
      src: sourceCode,
      state: initState,
    };
    
    const function_id = (await axios.post(TESTNET_ENDPOINT, body))?.data
      ?.function_id;
    console.log(function_id);
    return function_id;
  } catch (error) {
    console.log(error);
  }
}
```
### Send a transaction

- `POST /write`

```js
const TESTNET_ENDPOINT = "https://endpoint.something/write";

async function write() {
  try {
    const input = '{"function": "something"}'; // example: '{"function": "increment"}'
    const function_id = "your_function_id";

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
```
### Get function state

- `GET /state/:function_id`

### Get function data (state, source code, and exmContext)

- `GET /data/function/:function_id`

### Get all testnet deployed functions

- `GET /functions`

## License
This repository is licensed under the [MIT License](./LICENSE)
