"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNestedObject = exports.readFiles = exports.cleanDestination = exports.createDestination = void 0;
const del = require("del");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const lodash_1 = require("lodash");
function createDestination(dest) {
    return mkdirp.sync(dest);
}
exports.createDestination = createDestination;
function cleanDestination(dest) {
    return del(path.join(dest, "*"));
}
exports.cleanDestination = cleanDestination;
function readFiles(directory) {
    return fs.readdirSync(directory).reduce((prev, currentFile) => {
        const fileBuffer = fs.readFileSync(`${directory}/${currentFile}`);
        return Object.assign(Object.assign({}, prev), { [currentFile.replace(/\.json$/, "")]: JSON.parse(fileBuffer) });
    }, {});
}
exports.readFiles = readFiles;
function makeNestedObject(json) {
    let newobj = {};
    Object.keys(json).map((key) => {
        (0, lodash_1.set)(newobj, key, json[key]);
    });
    return newobj;
}
exports.makeNestedObject = makeNestedObject;
