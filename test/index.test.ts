import { check_contract } from "../src";

describe('cw-check', () => {
  it('should check wasm', async () => {
    const result = await check_contract('artifacts/hackatom.wasm', ['staking']);
    expect(result.ok).toBeTruthy();
  });
});
