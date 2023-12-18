/*
 * Conditions.js - represent a conditional installation instruction
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

import ExpressionEvaluator from './ExpressionEvaluator.js';

const specialChars = /[ \^\*~\-<>=]/;

class Conditions {
    constructor(conditionalConfig, nodeCompat) {
        this.conditions = conditionalConfig;
        this.nodeCompat = nodeCompat;

        this.evaluator = new ExpressionEvaluator(nodeCompat);
    }

    getInstallInstructions() {
        let instructions = [];

        for (let condition in this.conditions) {
            if (this.evaluator.evaluate(condition)) {
                const installInstructions = this.conditions[condition];
                instructions = instructions.concat(instructions, Object.keys(installInstructions).map(pkg => {
                    let versionSpec = installInstructions[pkg];
                    if (versionSpec.match(specialChars)) {
                        versionSpec = `"${versionSpec}"`;
                    }
                    return `${pkg}@${versionSpec}`;
                }));
            }
        }
        
        return instructions.join(" ");
    }
}

export default Conditions;