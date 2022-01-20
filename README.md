# ⛲ eslint-plugin-cascading-imports

![License](https://badgen.net/github/license/cheap-glitch/eslint-plugin-cascading-imports?color=green)
![Latest release](https://badgen.net/github/release/cheap-glitch/eslint-plugin-cascading-imports?color=green)
[![Coverage status](https://coveralls.io/repos/github/cheap-glitch/eslint-plugin-cascading-imports/badge.svg?branch=main)](https://coveralls.io/github/cheap-glitch/eslint-plugin-cascading-imports?branch=main)

This  plugin allows  to automatically  enforce  a visual  "cascading" order  for
import declarations.

Imports in each block will be sorted  according to the length of their bindings,
and if  equal then according to  the length of their  specifier. Imports without
bindings will be left untouched, as their order may be important.

Before:
```javascript
import { lorem, ipsum } from 'cicero';
import foo from 'foo';
import { bar as baz } from 'bar';
import { xizzy } from 'magic-words';

import './beforehand.css';
import './after.css';
import { Bandersnatch } from './jabberwocky.js';
import * as nebula from './lib/galaxy.js';
```

After:
```javascript
import foo from 'foo';
import { xizzy } from 'magic-words';
import { bar as baz } from 'bar';
import { lorem, ipsum } from 'cicero';

import './beforehand.css';
import './after.css';
import * as nebula from './lib/galaxy.js';
import { Bandersnatch } from './jabberwocky.js';
```

> Note: only ES6 import syntax is supported.

## Installation

```
npm i -D eslint-plugin-cascading-imports
```

Make sure you've also [installed ESLint](https://eslint.org/docs/user-guide/getting-started#installation-and-usage).

## Usage

This plugin exports a single rule, called `cascading-imports`:
```json
{
  "plugins": [
    "cascading-imports"
  ],
  "rules": {
    "cascading-imports/cascading-imports": "warn"
  }
}
```

The reported problems can be automatically fixed by running ESLint with the `--fix` option.

Please note this plugin only works properly if each import is on its own line. You can use the
[newline-after-import](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md)
from [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) to enforce this.

Also note that this plugin could conflict with other sorting rules, e.g.
[eslint-plugin-import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md).
To alleviate this, separate your imports in blocks according to their "type" (external, internal, etc).

## Changelog

See the full changelog [here](https://github.com/cheap-glitch/eslint-plugin-cascading-imports/releases).

## Contributing

Contributions are welcomed! Please open an issue before submitting substantial changes.

## Related

 * [sort-imports](https://eslint.org/docs/rules/sort-imports#import-sorting-sort-imports) - Core ESLint rule to sort imports and their bindings
 * [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) - Various ESLint rules to validate your imports

## License

ISC
