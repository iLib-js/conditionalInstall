/*
 * NodeCompat.test.js - test the node compatibility checker object
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

import NodeCompat from "../src/NodeCompat.js";
import fs from 'fs';
import semver from 'semver';

describe("testing the node compatibility check object", () => {
    test("that the constructor works okay", () => {
        expect.assertions(1);
        const nc = new NodeCompat();
        expect(nc).toBeTruthy();
    });

    test("make sure you can't call anything until it is initialized", () => {
        expect.assertions(3);

        const nc = new NodeCompat();
        expect(nc.init).toBeFalsy();
        expect(() => {
            nc.supportsFeature("Iterator.prototype.map")
        }).toThrow();
        expect(() => {
            nc.supportsEsVersion("ES2015")
        }).toThrow();
    });

    test("make sure it can load a local version of the compatibility data", () => {
        expect.assertions(3);

        const nc = new NodeCompat();
        nc.processVersionInfo("12.0.0", JSON.parse(fs.readFileSync("./test/12.0.0.json", "utf-8")));
        expect(nc.init).toBeTruthy();
        expect(nc.supportsFeature("Iterator.prototype.map")).toBeFalsy();
        expect(nc.supportsFeature("DataView.prototype.getBigInt64")).toBeTruthy();
    });

    test("make sure it can load a version of the compatibility data", () => {
        expect.assertions(3);

        const nc = new NodeCompat();
        // this gets its information from the current version of node that we are running on
        return nc.getVersionInfo().then(() => {
            expect(nc.init).toBeTruthy();
            if (semver.lt(process.versions.node, "v22.0.0")) {
                expect(nc.supportsFeature("Iterator.prototype.map")).toBeFalsy();
            } else {
                expect(nc.supportsFeature("Iterator.prototype.map")).toBeTruthy();
            }
            expect(nc.supportsFeature("DataView.prototype.getBigInt64")).toBeTruthy();
        });
    });

    test("make sure we can test a specific version", () => {
        expect.assertions(2);

        const nc = new NodeCompat();
        return nc.getVersionInfo("12.0.0").then(() => {
            expect(nc.supportsFeature("Iterator.prototype.map")).toBeFalsy();
            expect(nc.supportsFeature("DataView.prototype.getBigInt64")).toBeTruthy();
        });
    });

    test("make sure we can test if that version supports a particular version ECMAScript", () => {
        expect.assertions(2);

        const nc = new NodeCompat();
        return nc.getVersionInfo("12.0.0").then(() => {
            expect(nc.supportsEsVersion("ES2022")).toBeFalsy();
            expect(nc.supportsEsVersion("ES2015")).toBeTruthy();
        });
    });

    test("make sure we can test if that version supports aliases of ECMAScript versions", () => {
        expect.assertions(3);

        const nc = new NodeCompat();
        return nc.getVersionInfo("12.0.0").then(() => {
            expect(nc.supportsEsVersion("ES6")).toBeTruthy(); // same as ES2015
            expect(nc.supportsEsVersion("ESM")).toBeTruthy(); // same as ES2015
            expect(nc.supportsEsVersion("ES12")).toBeFalsy(); // same as ES2015
        });
    });
});
