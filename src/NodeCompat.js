/*
 * NodeCompat.js - download and represent node compatibility data
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

import fetch from 'node-fetch';

const ECMAScriptAliases = {
    "ES1": "ES1997",
    "ES2": "ES1998",
    "ES3": "ES2000",
    "ES4": "ES2005",
    "ES5": "ES2009",
    "ES6": "ES2015",
    "ES7": "ES2016",
    "ES8": "ES2017",
    "ES9": "ES2018",
    "ES10": "ES2019",
    "ES11": "ES2020",
    "ES12": "ES2021",
    "ES13": "ES2022",
    "ES14": "ES2023",
    "ESM": "ES2015",
    "CJS": "ES2009"
};

class NodeCompat {
    constructor() {
        this.init = false;
    }

    /**
     * Download version information about the version.
     *
     * @param {string} version version of node to check
     * @returns {Promise} promise to load the file
     * @accept {boolean} success
     * @reject {boolean} failure to load
     */
    async getVersionInfo(version) {
        const nodeVersion = (version || process.versions.node).replace('v', '')
        const url =
            `https://raw.githubusercontent.com/williamkapke/node-compat-table/gh-pages/results/v8/${nodeVersion}.json`;

        const response = await fetch(url);
        const result = await response.json();

        this.processVersionInfo(version, result);
    }

    /**
     * Download version information about the version.
     *
     * @param {string} version version of node to check
     * @returns {Promise} promise to load the file
     * @accept {boolean} success
     * @reject {boolean} failure to load
     */
    async processVersionInfo(version, result) {
        // does this version of node support that ECMAScript version?
        this.esVersions = {};
        Object.keys(result).
            filter(key => !key.startsWith('_')).
            forEach(version => {
                this.esVersions[version] = result[version]._percent > 0.99
            });
        ["ES1997", "ES1998", "ES2000", "ES2005", "ES2009"].forEach(ver => {
            if (typeof(this.esVersions[ver]) === 'undefined') {
                // if it's not mentioned, then just assume the older versions of ECMAScript are supported
                this.esVersions[ver] = true;
            }
        });
        // set the value of the aliases to the same thing as the thing they are aliases to
        for (let alias in ECMAScriptAliases) {
            this.esVersions[alias] = this.esVersions[ECMAScriptAliases[alias]];
        }

        // does this version of node support the named feature?
        this.featureIndex = {};
        this.info = Object.entries(result).
            filter(([key]) => !key.startsWith('_')).
            reverse().
            flatMap(([version, info]) => 
                Object.entries(info).
                filter(([key]) => !key.startsWith('_')).
                map(([key, value]) => {
                    const info = key.split('›');
                    const entry = {
                        esVersion: version,
                        featureType: info[0],
                        category: info[1],
                        feature: info[2],
                        passed: typeof value === 'string' ? false : value,
                    };

                    this.featureIndex[info[2]] = entry;
                    return entry;
                })
            );
        this.init = true;
    }

    hasFeature(name) {
        if (!this.init) {
            throw new Error("Not loaded yet");
        }
        return typeof(this.featureIndex[name]) !== 'undefined';
    }

    supportsFeature(name) {
        if (!this.init) {
            throw new Error("Not loaded yet");
        }
        return this.featureIndex[name]?.passed;
    }

    hasEsVersion(version) {
        if (!this.init) {
            throw new Error("Not loaded yet");
        }
        return typeof(this.esVersions[version]) === 'boolean';
    }

    supportsEsVersion(version) {
        if (!this.init) {
            throw new Error("Not loaded yet");
        }
        return this.esVersions[version];
    }
}

export default NodeCompat;