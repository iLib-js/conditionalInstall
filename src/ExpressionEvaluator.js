/*
 * ExpressionEvaluator.js - represent an expression
 *
 * Copyright © 2023 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ExpressionParser } from 'expressionparser';
import semver from 'semver';

import tokenize from './Tokenizer.js';

function booleanValue(node) {
    switch (node.type) {
        case 'boolean':
            return node.value;
        case 'version':
            return true;
        default:
            return !!node.value;
    }
}

function nodeValue(value) {
    if (semver.valid(value)) {
        return {
            type: 'version',
            value: semver.clean(value)
        };
    }
    const num = parseInt(value);
    if (!isNaN(num)) {
        return {
            type: "number",
            value: num
        };
    }

    if (value === "true") {
        return {
            type: "boolean",
            value: true
        };
    }
    if (value === "false") {
        return {
            type: "boolean",
            value: false
        };
    }

    return {
        type: "string",
        value
    };
}

/* convert a term in the expression to a value */
function termDelegate(term) {
    let node = nodeValue(term);

    if (node.type !== 'string') {
        return node;
    }

    if (term.startsWith("process.")) {
        const value = term.split(".").slice(1).reduce(
            (acc, part) => {
                if (!acc) {
                    return undefined;
                }
                return acc[part];
            },
            process
        );

        return nodeValue(value);
    }

    if (this.nodeCompat.hasEsVersion(node.value)) {
        return {
            type: "boolean",
            value: this.nodeCompat.supportsEsVersion(node.value)
        };
    }

    if (this.nodeCompat.hasFeature(node.value)) {
        return {
            type: "boolean",
            value: this.nodeCompat.supportsFeature(node.value)
        };
    }
    return node;
};

// configuration for our conditional expression language
const conditionalLanguage = {
    INFIX_OPS: {
        '=': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.eq(left.value, right.value) : 
                    left.value === right.value
            };
        },
        '!=': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.neq(left.value, right.value) :
                    left.value !== right.value
            };
        },
        '>': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.gt(left.value, right.value) :
                    left.value > right.value
            };
        },
        '>=': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.gte(left.value, right.value) :
                    left.value >= right.value
            };
        },
        '<': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.lt(left.value, right.value) :
                    left.value < right.value
            };
        },
        '<=': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: (left.type === "version") ? 
                    semver.lte(left.value, right.value) :
                    left.value <= right.value
            };
        },
        '&&': (l, r) => {
            const left = l();
            const right = r();
            return {
                type: "boolean",
                value: booleanValue(left) && booleanValue(right)
            };
        },
        '||': (l, r) => {
            const left = l();
            const right = r();
            if (left.type === 'version') {
                return {
                    type: 'version',
                    value: `${left.value} || ${right.value}`
                };
            }
            return {
                type: "boolean",
                value: booleanValue(left) || booleanValue(right)
            };
        },
        '~': (l, r) => {
            const left = l();
            const right = r();
            if (left.type !== 'version') {
                return { type: 'boolean', value: false };
            }
            return {
                type: "boolean",
                value: semver.satisfies(left.value, `~${right.value}`)
            };
        },
        '^': (l, r) => {
            const left = l();
            const right = r();
            if (left.type !== 'version') {
                return { type: 'boolean', value: false };
            }
            return {
                type: "boolean",
                value: semver.satisfies(left.value, `^${right.value}`)
            };
        },
        '-': (l, r) => {
            const left = l();
            const right = r();
            if (left.type !== 'version') {
                return { type: 'boolean', value: false };
            }
            return {
                type: 'version',
                value: `${left.value}-${right.value}`
            };
        },
    },
    PREFIX_OPS: {
        '!': (r) => {
            const right = r();
            return {
                type: 'boolean',
                value: !booleanValue(right)
            };
        },
    },
    PRECEDENCE: [
        ['-'],
        ['!'],
        ['=', '!=', '<', '<=', '>', '>='],
        ['&&', '||']
    ],
    GROUP_OPEN: '(',
    GROUP_CLOSE: ')',
    LITERAL_OPEN: "'",
    LITERAL_CLOSE: "'",
    SEPARATOR: ' ',
    AMBIGUOUS: {},
    SYMBOLS: ['(', ')', '=', '!', '<', '>', '&', '|', '-', '~', '^'],
    termTyper: (term) => {
        return "string";
    }
};

class ExpressionEvaluator {
    /**
     * Construct a new evaluator. The caller must pass in an already-initialized
     * NodeCompat instance so that we can use it for testing right away.
     *
     * @param {NodeCompat} nodeCompat the node compatibility checking object
     */
    constructor(nodeCompat) {
        this.nodeCompat = nodeCompat;
        // bind the term delegate function to this instance so that we can have
        // access to the nodeCompat instance
        const language = {
            ...conditionalLanguage,
            termDelegate: termDelegate.bind(this)
        };
        this.parser = new ExpressionParser(language);
    }

    /**
     * Parse the expression and evaluate it. Return the results of
     * the evaluation.
     *
     * @param {String} expression the expression to parse
     * @returns {boolean} the value of the expression
     */
    evaluate(expression) {
        const tokens = tokenize(expression);
        const result = this.parser.tokensToValue(tokens);
        return result?.value || false;
    }
}

export default ExpressionEvaluator;