/*
 * Conditions.test.js - test the conditions processor
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

import Conditions from "../src/Conditions.js";
import NodeCompat from "../src/NodeCompat.js";

const nc = new NodeCompat();
await nc.getVersionInfo("12.0.0");

describe("testing the conditions processor", () => {
    test("that an empty conditions config works", () => {
        expect.assertions(2);
        const conditions = new Conditions({}, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe("");
    });

    test("that a small conditions config works", () => {
        expect.assertions(2);
        const conditions = new Conditions({
            "ES2015": {
                "jest": "^29.0.0"
            }
        }, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe('jest@"^29.0.0"');
    });

    test("that a conditions config works", () => {
        expect.assertions(2);
        const conditions = new Conditions({
            "ES2015": {
                "jest": "^29.0.0",
                "jest-mock": "^29.0.0",
                "expect": "^29.0.0"
            }
        }, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe('jest@"^29.0.0" jest-mock@"^29.0.0" expect@"^29.0.0"');
    });

    test("that some conditions do not pass", () => {
        expect.assertions(2);
        const conditions = new Conditions({
            "ES2015": {
                "jest": "^29.0.0"
            },
            "Unicode 15.1": {
                "unicode-emojis": "5.23.2"
            }
        }, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe('jest@"^29.0.0"');
    });

    test("that conditions with no special chars work", () => {
        expect.assertions(2);
        const conditions = new Conditions({
            "ES2015": {
                "jest": "29.6.2",
                "jest-mock": "29.7.1",
                "expect": "29.1.0"
            }
        }, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe('jest@29.6.2 jest-mock@29.7.1 expect@29.1.0');
    });

    test("that conditions with ranges and other special chars work", () => {
        expect.assertions(2);
        const conditions = new Conditions({
            "ES2015": {
                "jest": "27.0.0 - 29.0.0",
                "jest-mock": "~29.0.0",
                "expect": ">=29.0.0"
            }
        }, nc);
        expect(conditions).toBeTruthy();
        expect(conditions.getInstallInstructions()).toBe('jest@"27.0.0 - 29.0.0" jest-mock@"~29.0.0" expect@">=29.0.0"');
    });
});
