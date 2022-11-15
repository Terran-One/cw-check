cw-check
======
This package contains a sample implementation to verify if the Wasm binary is a proper smart
contract
that's ready to be used with [cw-simulate](https://github.com/Terran-One/cw-simulate) or uploaded
on [cw-simulate-ui](https://console.terran.one).

### Getting Started

Install all the dependencies:

```bash
$ npm install
```

OR

```bash
$ yarn
```

### Usage

```bash
$ yarn check wasm/cw_simulate_tests-aarch64.wasm
```

### Example

```javascript
import {check_contract} from '@terran-one/cw-check';

const result = await check_contract('artifacts/hackatom.wasm', [])
```

### TODO

- [ ] Add more tests
- [ ] Add support for capabilities
