/*
 * Tokenizer.js - tokenize an expression string into an array of tokens
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

function emitLiteral(tokens, str, start, i) {
    const literal = str.substring(start, i).trim();
    if (literal) {
        tokens.push(literal);
    }
}

function tokenize(str) {
debugger;
    const len = str.length;
    let i = 0;
    let tokens = [];
    let literalStart = 0;

    while (i < len) {
        if (str[i] === '=') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === '~') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === '^') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === '-') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === '(') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === ')') {
            emitLiteral(tokens, str, literalStart, i);
            tokens.push(str[i]);
            literalStart = i+1;
        } else if (str[i] === '!') {
            emitLiteral(tokens, str, literalStart, i);
            if (i+1 < len && str[i+1] === '=') {
                i++;
                tokens.push("!=");
            } else {
                tokens.push(str[i]);
            }
            literalStart = i+1;
        } else if (str[i] === '>') {
            emitLiteral(tokens, str, literalStart, i);
            if (i+1 < len && str[i+1] === '=') {
                i++;
                tokens.push(">=");
            } else {
                tokens.push(str[i]);
            }
            literalStart = i+1;
        } else if (str[i] === '<') {
            emitLiteral(tokens, str, literalStart, i);
            if (i+1 < len && str[i+1] === '=') {
                i++;
                tokens.push("<=");
            } else {
                tokens.push(str[i]);
            }
            literalStart = i+1;
        } else if (str[i] === '&' && i+1 < len && str[i+1] === '&') {
            emitLiteral(tokens, str, literalStart, i);
            i++;
            tokens.push("&&");
            literalStart = i+1;
        } else if (str[i] === '|' && i+1 < len && str[i+1] === '|') {
            emitLiteral(tokens, str, literalStart, i);
            i++;
            tokens.push("||");
            literalStart = i+1;
        }

        i++;
    }

    emitLiteral(tokens, str, literalStart, i);

    return tokens;
}

export default tokenize;