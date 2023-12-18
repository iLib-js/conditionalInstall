#!/usr/bin/env node 
/*
 * conditional-install.js - wrapper around the conditional install package
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

var fs = require("fs");
var semver = require("semver");

// local require and import are for testing inside of the project whereas
// the "else" conditions are for when this script ends up in the .bin dir
if (semver.lte(process.versions.node, "14.0.0")) {
    if (fs.existsSync("./lib/index.js")) {
        require("./lib/index.js");
    } else {
        require("../conditional-install/lib/index.js");
    }
} else {
    if (fs.existsSync("./src/index.js")) {
        import("./src/index.js");
    } else {
        import("../conditional-install/src/index.js");
    }
}