import { check_contract, check_wasm, check_wasm_memories } from "../src";
import * as fs from "fs";

const CONTRACT = fs.readFileSync("artifacts/hackatom.wasm");
const CONTRACT_0_7 = fs.readFileSync("artifacts/hackatom_0.7.wasm");
const CONTRACT_0_12 = fs.readFileSync("artifacts/hackatom_0.12.wasm");
const CONTRACT_0_14 = fs.readFileSync("artifacts/hackatom_0.14.wasm");
const CONTRACT_0_15 = fs.readFileSync("artifacts/hackatom_0.15.wasm");

describe('cw-check', () => {
  it('check_contract', async () => {
    const result = await check_contract('artifacts/hackatom.wasm', ['staking']);
    expect(result.ok).toBeTruthy();
  });

  it('check_wasm passes for latest contract', async () => {
    const res = await check_wasm(CONTRACT, ['staking']);

    expect(res.ok).toBeTruthy();
  });

  it('check_wasm fails for 0.7 contract', async () => {
    const res = await check_wasm(CONTRACT_0_7, ['staking']);

    expect(res.err).toBeTruthy();
  });

  it('check_wasm fails for 0.12 contract', async () => {
    const res = await check_wasm(CONTRACT_0_12, ['staking']);

    expect(res.err).toBeTruthy();
  });

  it('check_wasm fails for 0.14 contract', async () => {
    const res = await check_wasm(CONTRACT_0_14, ['staking']);

    expect(res.err).toBeTruthy();
  });

  it('check_wasm fails for 0.15 contract', async () => {
    const res = await check_wasm(CONTRACT_0_15, ['staking']);

    expect(res.err).toBeTruthy();
  });

  it.skip('check_wasm_memories fails with no memory', async () => {
    const wasm = Buffer.from("(module)");
    // convert string to bytes
    const module = await WebAssembly.compile(wasm);
    const res = check_wasm_memories(module);
    console.log(res);
  });

  it('check_wasm_memories fails with two memories', async () => {});
  it('check_wasm_memories fails with zero memory', async () => {});
  it('check_interface_version works', async () => {});
  it('check_wasm_exports works', async () => {});
  it('check_wasm_exports fails for old contract', async () => {});
  it('check_wasm_imports works', async () => {});
  it('check_wasm_imports fails for missing imports', async () => {});
  it('check_wasm_imports fails for old contract', async () => {});
  it('check_wasm_imports fails for wrong type', async () => {});
  it('check_wasm_capabilities works', async () => {});
  it('check_wasm_capabilities fails', async () => {});
});
