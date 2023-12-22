var path = require("path");
var semver = require("semver");

var settings = {
    moduleFileExtensions: ['js', 'jsx', 'json'],

    transform: {},

    transformIgnorePatterns: ["/node_modules/"],

    moduleDirectories: ['src', 'node_modules']
};

// for node 15 and below
if (semver.lte(process.versions.node, 'v16.0.0')) {
    settings.transform = {
        "\\.[jt]sx?$": ["babel-jest", {
            presets: [[
                '@babel/preset-env', {
                    "targets": {
                        "node": "current",
                        "browsers": "cover 99.5%"
                    },
                    "useBuiltIns": "usage",
                    "corejs": 3
                }
            ]],
            compact: false,
            minified: false,
            ignore: [
                "/node_modules/"
            ],
            plugins: [
                "@babel/plugin-proposal-optional-chaining",
                "transform-import-meta",
                "add-module-exports",
                ["module-resolver", {
                    "root": "test",
                    // map the src dir to the lib dir so we can
                    // test the commonjs code
                    "alias": {
                        "../src": "../lib"
                    }
                }]
            ]
        }]
    };
}

module.exports = settings;
