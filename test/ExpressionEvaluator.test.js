/*
 * ExpressionEvaluator.test.js - test the expression evaluator object
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

import ExpressionEvaluator from "../src/ExpressionEvaluator.js";
import NodeCompat from "../src/NodeCompat.js";

const nc = new NodeCompat();
await nc.getVersionInfo("12.0.0");

describe("testing the expression evaluator object", () => {
    test("that the constructor works okay", () => {
        expect.assertions(1);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
    });

    test("that it can evaluate a simple expression with a process variable", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.libdir = lib")).toBe(true);
    });

    test("that it can evaluate a simple expression with a process variable negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.libdir = bar")).toBe(false);
    });

    test("that it can evaluate a simple expression with a process variable with a space in the term", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.libdir = lib lab")).toBe(false);
    });

    test("that it can evaluate a simple expression with not equal", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.libdir != foo")).toBe(true);
    });

    test("that it can evaluate a simple expression with not equal negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.libdir != lib")).toBe(false);
    });

    test("that it can evaluate a simple expression with greater than", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major > 1")).toBe(true);
    });

    test("that it can evaluate a simple expression with greater than negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major > 99999")).toBe(false);
    });

    test("that it can evaluate a simple expression with greater than or equal to", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.config.variables.icu_ver_major >= ${icuVersion}`)).toBe(true);
    });

    test("that it can evaluate a simple expression with greater than or equal to negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major >= 99999")).toBe(false);
    });

    test("that it can evaluate a simple expression with less than", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major < 99999")).toBe(true);
    });

    test("that it can evaluate a simple expression with less than negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major < 1")).toBe(false);
    });

    test("that it can evaluate a simple expression with greater than or equal to", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.config.variables.icu_ver_major <= ${icuVersion}`)).toBe(true);
    });

    test("that it can evaluate a simple expression with greater than or equal to negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.icu_ver_major <= 1")).toBe(false);
    });

    test("that it can evaluate a simple expression with a false boolean value", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.debug_node")).toBe(false);
    });

    test("that it can evaluate a simple expression with a true boolean value", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("process.config.variables.node_use_v8_platform")).toBe(true);
    });

    test("that it can evaluate a simple true expression with a not", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("!process.config.variables.debug_node")).toBe(true);
    });

    test("that it can evaluate a simple false expression with a not", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("!process.config.variables.node_use_v8_platform")).toBe(false);
    });

    test("that it can evaluate a more complex expression with and", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.config.variables.node_use_v8_platform && process.config.variables.icu_ver_major = ${icuVersion}`)).toBe(true);
    });

    test("that it can evaluate a more complex expression with 'and' and brackets", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.config.variables.node_use_v8_platform && (process.config.variables.icu_ver_major = ${icuVersion})`)).toBe(true);
    });

    test("that it can evaluate a more complex expression with 'and' and unbalanced brackets", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(() => ev.evaluate(`process.config.variables.node_use_v8_platform && (process.config.variables.icu_ver_major = ${icuVersion}`)).toThrow();
    });

    test("that it can evaluate a more complex expression with and negative", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`!process.config.variables.node_use_v8_platform && process.config.variables.icu_ver_major = ${icuVersion}`)).toBe(false);
    });

    test("that it can evaluate a more complex expression with or", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`!process.config.variables.node_use_v8_platform || process.config.variables.icu_ver_major = ${icuVersion}`)).toBe(true);
    });

    test("that it can evaluate a more complex expression with or negative", () => {
        expect.assertions(2);
        const icuVersion = process.config.variables.icu_ver_major;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`!process.config.variables.node_use_v8_platform || process.config.variables.icu_ver_major != ${icuVersion}`)).toBe(false);
    });

    test("that it can evaluate a simple expression with a version and a carat", () => {
        expect.assertions(2);
        const thisVersion = process.versions.node;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.versions.node ^ ${thisVersion}`)).toBe(true);
    });

    test("that it can evaluate a simple expression with a version and a tilde", () => {
        expect.assertions(2);
        const thisVersion = process.versions.node;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.versions.node ~ ${thisVersion}`)).toBe(true);
    });

    test("that it can evaluate a simple false expression with a version and brackets", () => {
        expect.assertions(2);
        const thisVersion = process.versions.node;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`!(process.versions.node ^ ${thisVersion})`)).toBe(false);
    });

    test("that it can evaluate a simple expression with a language feature", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("DataView.prototype.getBigInt64")).toBe(true);
    });

    test("that it can evaluate a simple expression with a language feature with spaces", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("Array.prototype.includes handles sparse arrays")).toBe(true);
    });

    test("that it can evaluate a simple expression with an ES version", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("ES2015")).toBe(true);
    });

    test("that it can evaluate a simple expression with an ES version negative", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("ES2023")).toBe(false);
    });

    test("that it can evaluate a complex expression with an ES version and others", () => {
        expect.assertions(2);
        const thisVersion = process.versions.node;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.versions.node >= ${thisVersion} && ES2015`)).toBe(true);
    });

    test("that it can evaluate a complex expression with an ES version and others negative", () => {
        expect.assertions(2);
        const thisVersion = process.versions.node;
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate(`process.versions.node >= ${thisVersion} && ES2024`)).toBe(false);
    });

    test("that it can evaluate a complex expression with multiple features with spaces", () => {
        expect.assertions(2);
        const ev = new ExpressionEvaluator(nc);
        expect(ev).toBeTruthy();
        expect(ev.evaluate("RegExp named capture groups && (Unicode 12 || Unicode 11)")).toBe(true);
    });
});
