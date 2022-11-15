#!/usr/bin/env node

import { Command, program } from 'commander';
import * as fs from "fs";
import { Err, Ok, Result } from "ts-results";

const SUPPORTED_INTERFACE_VERSIONS = ["interface_version_7", "interface_version_8"];
const SUPPORTED_IMPORTS = [
  "env.abort",
  "env.db_read",
  "env.db_write",
  "env.db_remove",
  "env.addr_validate",
  "env.addr_canonicalize",
  "env.addr_humanize",
  "env.secp256k1_verify",
  "env.secp256k1_recover_pubkey",
  "env.ed25519_verify",
  "env.ed25519_batch_verify",
  "env.debug",
  "env.query_chain",
  "env.db_scan",
  "env.db_next",
];

const REQUIRED_EXPORTS = [
  "allocate",
  "deallocate",
  "instantiate"
];

export async function check_contract(path: string, availableCapabilities: string[]): Promise<Result<any, string>> {
  // Check if file exists
  if (!fs.existsSync(path)) {
    console.error(`File ${path} does not exist`);
  }

  const contents = fs.readFileSync(path);

  // Check Wasm
  const wasm = await check_wasm(contents, availableCapabilities);
  if (wasm.err) {
    return Promise.reject(wasm.val);
  }

  // Compile module
  compile(contents);

  return Promise.resolve(Ok(undefined));
}

export async function check_wasm(wasmBuffer: Buffer, availableCapabilities: string[]): Promise<Result<void, string>> {
  const module = await WebAssembly.compile(wasmBuffer);
  const memories = check_wasm_memories(module);
  if (memories.err) {
    return memories;
  }

  const version = check_interface_version(module);
  if (version.err) {
    return version;
  }

  const exports = check_wasm_exports(module);
  if (exports.err) {
    return exports;
  }

  const imports = check_wasm_imports(module);
  if (imports.err) {
    return imports;
  }

  const capabilities = check_wasm_capabilities(module, availableCapabilities);
  if (capabilities.err) {
    return capabilities;
  }

  return Ok(undefined);
}

export function check_wasm_memories(module: WebAssembly.Module): Result<void, string> {
  const memories = WebAssembly.Module.exports(module).filter((exported) => exported.kind === 'memory');
  if (memories.length === 0) {
    return Err('Wasm contract doesn\'t have a memory section');
  }

  if (memories.length > 1) {
    return Err('Wasm contract must contain exactly one memory');
  }

  return Ok(undefined);
}

export function check_interface_version(module: WebAssembly.Module): Result<void, string> {
  const exports = WebAssembly.Module.exports(module);
  console.log(exports);

  const interfaceVersionExports = exports.filter((exported) => exported.name.indexOf('interface_version_') === 0);

  if (interfaceVersionExports.length === 0) {
    return Err('Wasm contract missing a required marker export: interface_version_*');
  }

  if (interfaceVersionExports.length > 1) {
    return Err('Wasm contract contains more than one marker export: interface_version_*');
  } else {
    const interfaceVersion = interfaceVersionExports[0];
    if (!SUPPORTED_INTERFACE_VERSIONS.includes(interfaceVersion.name)) {
      return Err('Wasm contract has unknown interface_version_* marker export (see https://github.com/CosmWasm/cosmwasm/blob/main/packages/vm/README.md)');
    } else {
      return Ok(undefined)
    }
  }
}

export function check_wasm_exports(module: WebAssembly.Module): Result<void, string> {
  const exports = WebAssembly.Module.exports(module);

  REQUIRED_EXPORTS.forEach((requiredExport: string) => {
    if (!exports.some((exported) => exported.name === requiredExport)) {
      return Err(`Wasm contract doesn't have required export: \"${requiredExport}\". Exports required by VM: ${REQUIRED_EXPORTS}.`);
    } else {
      return Ok(undefined);
    }
  });

  return Ok(undefined);
}

export function check_wasm_imports(module: WebAssembly.Module): Result<void, string> {
  const imports = WebAssembly.Module.imports(module);

  SUPPORTED_IMPORTS.forEach((supportedImport: string) => {
    if (!imports.some((imported) => `${imported.module}.${imported.name}` === supportedImport)) {
      return Err(`Wasm contract doesn't have required import: \"${supportedImport}\". Imports required by VM: ${SUPPORTED_IMPORTS}.`);
    } else {
      return Ok(undefined);
    }
  });

  return Ok(undefined);
}

export function compile(contents: Buffer): Ok<WebAssembly.Module> {
  const module = new WebAssembly.Module(contents);
  return Ok(module);
}

export function check_wasm_capabilities(module: WebAssembly.Module, availableCapabilities: string[]): Result<void, string> {
  console.log(availableCapabilities);
  console.log(module);
  return Ok(undefined);
}

// Only run this script if it is called directly
if (require.main === module) {
  try {
    const command: Command = program
    .version('0.0.1')
    .description('A CLI to verify the CosmWasm contract validity');

    command.argument('<path>', 'Path to the contract');
    command.description('Check the contract');
    command.action(async (path: string) => {
      await check_contract(path, []);
    });

    command.argument('-c, --capabilities <capabilities>', 'List of capabilities');
    command.description('Check the contract with capabilities');

    program.parse(process.argv);
  } catch (error) {
    console.error(error);
  }
}
