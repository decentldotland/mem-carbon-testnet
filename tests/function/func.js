export async function handle(state, action) {
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
