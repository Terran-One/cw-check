import { check_contract } from "../src";

describe('cw-check', () => {
  it('check_contract', async () => {
    const result = await check_contract('artifacts/hackatom.wasm', ['staking']);
    expect(result.ok).toBeTruthy();
  });
});
