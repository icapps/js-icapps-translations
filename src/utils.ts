import * as del from "del";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import { set } from "lodash";

/**
 * Create a new destination folder
 */
export function createDestination(dest: string) {
  return mkdirp.sync(dest);
}

/**
 * Clean the previously stored destination folder
 */
export function cleanDestination(dest: string) {
  return del(path.join(dest, "*"));
}

/**
 * Read multiple files from a directory and place json content onto key/value object
 * @param {String} directory
 */
export function readFiles(directory: string) {
  return fs.readdirSync(directory).reduce((prev, currentFile) => {
    const fileBuffer: any = fs.readFileSync(`${directory}/${currentFile}`);
    return {
      ...prev,
      [currentFile.replace(/\.json$/, "")]: JSON.parse(fileBuffer),
    };
  }, {});
}

export function makeNestedObject(json: Record<string, string>) {
  let newobj = {};

  Object.keys(json).map((key) => {
    set(newobj, key, json[key]);
  });

  return newobj;
}
