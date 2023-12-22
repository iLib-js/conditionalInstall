/*
 * Tokenizer.test.js - test the expression tokenizer
 *
 * Copyright © 2023, JEDLSoft
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

import Tokenizer from "../src/Tokenizer.js";

describe("testing the expression tokenizer", () => {
    test("that a simple literal works", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo");
        expect(tokens).toStrictEqual(['foo']);
    });

    test("that a simple expression works", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo = bar");
        expect(tokens).toStrictEqual(['foo', '=', 'bar']);
    });

    test("that extra whitespace is ignored", () => {
        expect.assertions(1);
        const tokens = Tokenizer("\t  foo   =    bar   ");
        expect(tokens).toStrictEqual(['foo', '=', 'bar']);
    });

    test("that a literal with spaces in it works", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo bar foo");
        expect(tokens).toStrictEqual(['foo bar foo']);
    });

    test("that a simple expression works with less than", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo < bar");
        expect(tokens).toStrictEqual(['foo', '<', 'bar']);
    });

    test("that a simple expression works with less than or equal to", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo <= bar");
        expect(tokens).toStrictEqual(['foo', '<=', 'bar']);
    });

    test("that a simple expression works with greater than", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo > bar");
        expect(tokens).toStrictEqual(['foo', '>', 'bar']);
    });

    test("that a simple expression works with greater than or equal to", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo >= bar");
        expect(tokens).toStrictEqual(['foo', '>=', 'bar']);
    });

    test("that a simple expression works with tilde", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo ~ bar");
        expect(tokens).toStrictEqual(['foo', '~', 'bar']);
    });

    test("that a simple expression works with carat", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo ^ bar");
        expect(tokens).toStrictEqual(['foo', '^', 'bar']);
    });

    test("that a simple expression works with dash", () => {
        expect.assertions(1);
        const tokens = Tokenizer("foo ^ v18.0.0 - v18.4.4");
        expect(tokens).toStrictEqual(['foo', '^', 'v18.0.0', '-', 'v18.4.4']);
    });

    test("that a simple expression works with not", () => {
        expect.assertions(1);
        const tokens = Tokenizer("!foo");
        expect(tokens).toStrictEqual(['!', 'foo']);
    });

    test("that a simple expression works with spaces in the literal", () => {
        expect.assertions(1);
        const tokens = Tokenizer("process.config.variables.x = foo bar foo");
        expect(tokens).toStrictEqual(['process.config.variables.x', '=', 'foo bar foo']);
    });

    test("that a complex expression works with and", () => {
        expect.assertions(1);
        const tokens = Tokenizer("!bar && (foo > bar)");
        expect(tokens).toStrictEqual(['!', 'bar', '&&', '(', 'foo', '>', 'bar', ')']);
    });

    test("that a complex expression works with or", () => {
        expect.assertions(1);
        const tokens = Tokenizer("!bar || (foo > bar)");
        expect(tokens).toStrictEqual(['!', 'bar', '||', '(', 'foo', '>', 'bar', ')']);
    });
});
