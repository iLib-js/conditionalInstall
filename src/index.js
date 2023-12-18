/*
 * index.js - implement conditional package installation
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

import { execSync } from 'child_process';
import fs from 'fs';

import Conditions from './Conditions.js';
import NodeCompat from './NodeCompat.js';

function findPkgJson() {
}

try {
    const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

    // no config? Then there is nothing to do!
    if (!pkg.conditionalDependencies || Object.keys(pkg.conditionalDependencies).length < 1) {
        process.exit(0);
    }

    const nc = new NodeCompat();
    nc.getVersionInfo("12.0.0").then(() => {
        const conditions = new Conditions(pkg.conditionalDependencies, nc);
        const packages = conditions.getInstallInstructions();
        if (packages.length) {
            const command = `npm install --no-save ${packages}`;
            console.log(command);
            execSync(command);
        }
    });
} catch (e) {
    console.err("Could not read the package.json file.");
}