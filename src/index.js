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
import path from 'path';

import Conditions from './Conditions.js';
import NodeCompat from './NodeCompat.js';

// Search the parents to find the main package.json that contains the name and version
// number, and ignore any auxillary ones found on the way.
function findPkgJson() {
    let pkgpath = process.cwd();
    while (true) {
        while (pkgpath.length > 1 && !fs.existsSync(path.join(pkgpath, "package.json"))) {
            pkgpath = path.join(path.dirname(pkgpath));
        }

        const finalpath = path.join(pkgpath, "package.json");
        if (!fs.existsSync(finalpath)) {
            console.log("Error: could not find the package.json file in any parent directory");
            process.exit(1);
        }

        const pkg = JSON.parse(fs.readFileSync(finalpath, "utf-8"));
        if (typeof(pkg.name) !== 'undefined' && typeof(pkg.version) !== 'undefined') {
           // this is a main package.json, so return it. Change dir to where this package.json
           // is so that the install will apply to that one
           process.chdir(pkgpath);
           return pkg;
        }

        // else, this is an auxillary package.json, so continue to look in the parents again
        pkgpath = path.join(path.dirname(pkgpath));
    }
}

if (process.argv.length > 2 && process.argv[2].toLowerCase() === "--help") {
    console.log("Usage: conditional-install [--help]");
    console.log("Conditionally install js package dependencies.");
    console.log("See https://github.com/ilib-js/conditionalInstall for more details");
    process.exit(0);
}

try {
    const pkg = findPkgJson();

    // no config? Then there is nothing to do!
    if (!pkg.conditionalDependencies || Object.keys(pkg.conditionalDependencies).length < 1) {
        process.exit(0);
    }

    const nc = new NodeCompat();
    nc.getVersionInfo().then(() => {
        const conditions = new Conditions(pkg.conditionalDependencies, nc);
        const packages = conditions.getInstallInstructions();
        if (packages.length) {
            const command = `npm install --no-save ${packages}`;
            console.log(command);
            execSync(command);
        }
    });
} catch (e) {
    console.err("Could not read the package.json file." + e);
    process.exit(1);
}