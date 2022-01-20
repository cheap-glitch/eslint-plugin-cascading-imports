/*
 *!
 * eslint-plugin-cascading-imports
 *
 * Sort import declarations into a pleasing and readable cascade.
 *
 * Copyright (c) 2022-present, cheap glitch
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import type { Rule, AST } from 'eslint';

interface ImportDeclaration {
	node: Rule.Node;
	fullLength: number;
	bindingLength: number;
}

export const rules: Record<string, Rule.RuleModule> = {
	'cascading-imports': {
		meta: {
			type: 'layout',
			fixable: 'code',
			docs: {
				description: 'Sort your import declarations in a readable and pleasing way.',
				category: 'stylistic issues',
				url: 'https://github.com/cheap-glitch/eslint-plugin-cascading-imports#readme',
			},
		},
		create(context) {
			const previousImportDeclarations: ImportDeclaration[] = [];

			return {
				ImportDeclaration(node: Rule.Node): void {
					const result = lintImportDeclaration(context, node, previousImportDeclarations);
					if (result === false) {
						// Keep track of misplaced or invalid declarations but ignore their length
						previousImportDeclarations.push({ node, fullLength: -1, bindingLength: -1 });

						return;
					}

					previousImportDeclarations.push(result);
				},
			};
		},
	},
};

function lintImportDeclaration(context: Rule.RuleContext, node: Rule.Node, previousImportDeclarations: ImportDeclaration[]): ImportDeclaration | false {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- `ImportDeclaration` nodes will always have a location
	const nodeLocation = node.loc!;
	const startLine = nodeLocation.start.line;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- `ImportDeclaration` nodes will always have a location
	const lastDeclarationEndLine = previousImportDeclarations.length > 0 ? previousImportDeclarations[previousImportDeclarations.length - 1].node.loc!.end.line : -1;

	// Reset at the beginning of a new block
	if (startLine > lastDeclarationEndLine + 1) {
		previousImportDeclarations.length = 0;
	}

	const nodeText = context.getSourceCode().getText(node);
	const fullLength = nodeText.length;
	const bindingLength = nodeText.lastIndexOf(' from ');

	// Ignore overlapping declarations
	if (startLine === lastDeclarationEndLine) {
		return false;
	}
	// Ignore unassigned declarations, as their importing order might be important
	if (bindingLength === -1) {
		return false;
	}
	// Ignore declarations containing extraneous white space
	if (/^\s|\s$/u.test(nodeText) || /\s{2,}/u.test(nodeText)) {
		return false;
	}

	for (const previousDeclaration of previousImportDeclarations) {
		if (!checkImportDeclarationOrder({ node, fullLength, bindingLength }, previousDeclaration)) {
			const [rangeStart, rangeEnd] = getNodeRange(context, node);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- `ImportDeclaration` nodes will always have a location
			const lineNumberOffset = startLine - previousDeclaration.node.loc!.end.line;
			context.report({
				loc: nodeLocation,
				message: `Expected import declaration to be ${lineNumberOffset} line${lineNumberOffset > 1 ? 's' : ''} above.`,
				fix(fixer) {
					// To fix, remove the line of the misplaced declaration and re-insert it before the previous one
					return [
						fixer.removeRange([rangeStart - 1, rangeEnd]),
						fixer.insertTextBefore(previousDeclaration.node, nodeText + '\n'),
					];
				},
			});

			return false;
		}
	}

	return { node, fullLength, bindingLength };
}

function checkImportDeclarationOrder({ fullLength, bindingLength }: ImportDeclaration, previousDeclaration: ImportDeclaration): boolean {
	if (bindingLength > previousDeclaration.bindingLength) {
		return true;
	}

	if (bindingLength === -1 || bindingLength === previousDeclaration.bindingLength) {
		return fullLength >= previousDeclaration.fullLength;
	}

	return false;
}

function getNodeRange(context: Rule.RuleContext, node: Rule.Node): AST.Range {
	const tokens = context.getSourceCode().getTokens(node);

	return [tokens[0].range[0], tokens[tokens.length - 1].range[1]];
}
