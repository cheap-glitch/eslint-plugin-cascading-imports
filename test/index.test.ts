import outdent from 'outdent';
import { RuleTester } from 'eslint';

import { rules } from '../src';

new RuleTester({
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module',
	},
})
.run('cascading-imports', rules['cascading-imports'], {
	valid: [

		// Single block
		outdent`
			import React from 'dom-chef';
			import select from 'select-dom';
			import delegate from 'delegate-it';
		`,

		// Single block with various kinds of imports
		outdent`
			import './table-input.css';
			import React from 'dom-chef';
			import select from 'select-dom';
			import delegate from 'delegate-it';
			import {TableIcon} from '@primer/octicons-react';
			import * as pageDetect from 'github-url-detection';
			import * as textFieldEdit from 'text-field-edit';
		`,

		// Multiple blocks
		outdent`
			import twas from 'twas';
			import React from 'dom-chef';
			import cache from 'webext-storage-cache';
			import {RepoIcon} from '@primer/octicons-react';
			import elementReady from 'element-ready';
			import * as pageDetect from 'github-url-detection';

			import features from '.';
			import * as api from '../github-helpers/api';
			import {getRepo} from '../github-helpers';
		`,

		// Aligned `from` keywords
		outdent`
			import twas from 'twas';
			import React from 'dom-chef';
			import cache from 'webext-storage-cache';
		`,

		// Import named `from`
		outdent`
			import lorem from 'lorem-ipsum';
			import { from } from 'tricky-package';
		`,

		// Ignored declarations on the same line
		outdent`
			import React from 'dom-chef';
			import delegate from 'delegate-it'; import select from 'select-dom';
			import * as pageDetect from 'github-url-detection';
		`,

		// Ignored unassigned declarations
		outdent`
			import 'webext-base-css/webext-base.css';
			import './options.css';
		`,

		// Ignored declarations with extra white space
		outdent`
			import delegate    from 'delegate-it';
			import select from   'select-dom';
			import   React from 'dom-chef';
		`,

		// Multi-line import declarations
		outdent`
			import features from '.';
			import {
				prCommitUrlRegex,
				preventPrCommitLinkLoss,
				prCompareUrlRegex,
				preventPrCompareLinkLoss,
				discussionUrlRegex,
				preventDiscussionLinkLoss,
			} from '../github-helpers/prevent-link-loss';
			import {createRghIssueLink} from '../helpers/rgh-issue-link';
		`,

	],
	invalid: [

		{
			// Single block
			code: outdent`
				import React from 'dom-chef';
				import delegate from 'delegate-it';
				import select from 'select-dom';
			`,
			output: outdent`
				import React from 'dom-chef';
				import select from 'select-dom';
				import delegate from 'delegate-it';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 3,
				column: 1,
				endLine: 3,
				endColumn: 33,
			}],
		},

		{
			// Single block with various kinds of imports
			code: outdent`
				import './table-input.css';
				import select from 'select-dom';
				import React from 'dom-chef';
				import {TableIcon} from '@primer/octicons-react';
				import * as pageDetect from 'github-url-detection';
				import * as textFieldEdit from 'text-field-edit';
				import delegate from 'delegate-it';
			`,
			output: outdent`
				import './table-input.css';
				import React from 'dom-chef';
				import select from 'select-dom';
				import delegate from 'delegate-it';
				import {TableIcon} from '@primer/octicons-react';
				import * as pageDetect from 'github-url-detection';
				import * as textFieldEdit from 'text-field-edit';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 3,
				column: 1,
				endLine: 3,
				endColumn: 30,
			}, {
				message: 'Expected import declaration to be 3 lines above.',
				line: 7,
				column: 1,
				endLine: 7,
				endColumn: 36,
			}],
		},

		{
			// Multiple blocks
			code: outdent`
				import twas from 'twas';
				import React from 'dom-chef';
				import cache from 'webext-storage-cache';
				import {RepoIcon} from '@primer/octicons-react';
				import * as pageDetect from 'github-url-detection';
				import elementReady from 'element-ready';

				import * as api from '../github-helpers/api';
				import {getRepo} from '../github-helpers';
				import features from '.';
			`,
			output: outdent`
				import twas from 'twas';
				import React from 'dom-chef';
				import cache from 'webext-storage-cache';
				import {RepoIcon} from '@primer/octicons-react';
				import elementReady from 'element-ready';
				import * as pageDetect from 'github-url-detection';

				import features from '.';
				import * as api from '../github-helpers/api';
				import {getRepo} from '../github-helpers';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 6,
				column: 1,
				endLine: 6,
				endColumn: 42,
			}, {
				message: 'Expected import declaration to be 2 lines above.',
				line: 10,
				column: 1,
				endLine: 10,
				endColumn: 26,
			}],
		},

		{
			// Aligned `from` keywords
			code: outdent`
				import twas from 'twas';
				import cache from 'webext-storage-cache';
				import React from 'dom-chef';
			`,
			output: outdent`
				import twas from 'twas';
				import React from 'dom-chef';
				import cache from 'webext-storage-cache';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 3,
				column: 1,
				endLine: 3,
				endColumn: 30,
			}],
		},

		{
			// Import named `from`
			code: outdent`
				import { from } from 'tricky-package';
				import lorem from 'lorem-ipsum';
			`,
			output: outdent`
				import lorem from 'lorem-ipsum';
				import { from } from 'tricky-package';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 2,
				column: 1,
				endLine: 2,
				endColumn: 33,
			}],
		},

		{
			// Multi-line import declarations
			code: outdent`
				import {createRghIssueLink} from '../helpers/rgh-issue-link';
				import {
					prCommitUrlRegex,
					preventPrCommitLinkLoss,
					prCompareUrlRegex,
					preventPrCompareLinkLoss,
					discussionUrlRegex,
					preventDiscussionLinkLoss,
				} from '../github-helpers/prevent-link-loss';
				import features from '.';
			`,
			output: outdent`
				import features from '.';
				import {createRghIssueLink} from '../helpers/rgh-issue-link';
				import {
					prCommitUrlRegex,
					preventPrCommitLinkLoss,
					prCompareUrlRegex,
					preventPrCompareLinkLoss,
					discussionUrlRegex,
					preventDiscussionLinkLoss,
				} from '../github-helpers/prevent-link-loss';
			`,
			errors: [{
				message: 'Expected import declaration to be 9 lines above.',
				line: 10,
				column: 1,
				endLine: 10,
				endColumn: 26,
			}],
		},

		{
			// Readme example
			code: outdent`
				import { lorem, ipsum } from 'cicero';
				import foo from 'foo';
				import { bar as baz } from 'bar';
				import { xizzy } from 'magic-words';

				import './beforehand.css';
				import './after.css';
				import { Bandersnatch } from './jabberwocky.js';
				import * as nebula from './lib/galaxy.js';
			`,
			output: outdent`
				import foo from 'foo';
				import { lorem, ipsum } from 'cicero';
				import { bar as baz } from 'bar';
				import { xizzy } from 'magic-words';

				import './beforehand.css';
				import './after.css';
				import * as nebula from './lib/galaxy.js';
				import { Bandersnatch } from './jabberwocky.js';
			`,
			errors: [{
				message: 'Expected import declaration to be 1 line above.',
				line: 2,
				column: 1,
				endLine: 2,
				endColumn: 23,
			}, {
				message: 'Expected import declaration to be 2 lines above.',
				line: 3,
				column: 1,
				endLine: 3,
				endColumn: 34,
			}, {
				message: 'Expected import declaration to be 3 lines above.',
				line: 4,
				column: 1,
				endLine: 4,
				endColumn: 37,
			}, {
				message: 'Expected import declaration to be 1 line above.',
				line: 9,
				column: 1,
				endLine: 9,
				endColumn: 43,
			}],
		},

	],
});
