"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTranslations = void 0;
const lodash_1 = require("lodash");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const mkdirp = require("mkdirp");
const defaults_1 = require("./defaults");
function fillSample(blueprint, config) {
    const mergedSample = (0, lodash_1.defaults)((0, lodash_1.pick)(config, ["apiToken", "translationsPath"]), blueprint);
    return JSON.stringify(mergedSample, null, 4);
}
function getConfigPath() {
    return new Promise((resolve, reject) => {
        const questions = [
            {
                name: "configPath",
                message: "Where should the configuration go?",
                default: "./src/_translations/config/",
            },
            {
                name: "overwriteConfig",
                message: (answers) => `'${answers.configPath}' already exists. Shall we overwrite this?`,
                default: true,
                type: "confirm",
                when: (answers) => fs.existsSync(answers.configPath),
            },
        ];
        inquirer.prompt(questions, (answers) => {
            if (answers.overwriteConfig === true ||
                (0, lodash_1.isUndefined)(answers.overwriteConfig)) {
                resolve(answers.configPath);
            }
            else {
                reject();
            }
        });
    });
}
function createConfigFile(configurationPath) {
    return new Promise((resolve, reject) => {
        try {
            mkdirp(configurationPath);
        }
        catch (err) {
            reject(err);
        }
        const questions = [
            {
                name: "translationsPath",
                message: "Where should the locales go? (e.g. nl-be.json)",
                default: defaults_1.DEFAULT_OPTIONS.destination,
            },
            {
                name: "hasApiToken",
                message: "Do you already have an API Token from translations.icapps.be?",
                default: false,
                type: "confirm",
            },
            {
                name: "apiToken",
                message: "Please provide your API token for translations.icapps.be:",
                default: null,
                when: (answers) => answers.hasApiToken,
            },
        ];
        inquirer.prompt(questions, (answers) => {
            const fullPath = path.join(configurationPath, "translations.json");
            fs.writeFile(fullPath, fillSample(defaults_1.SAMPLE, answers), () => resolve(fullPath));
        });
    });
}
function checkGitignore() {
    return new Promise((resolve) => {
        const gitignore = fs.readFileSync("./.gitignore").toString();
        const isPresent = /.+translations.json/g.test(gitignore);
        const questions = [
            {
                name: "addToGitignore",
                message: `translations.json is not in the .gitignore file.
                This is recommended, shall we add it?`,
                type: "confirm",
                when: () => !isPresent,
            },
        ];
        inquirer.prompt(questions, (answers) => {
            if (answers.addToGitignore) {
                fs.appendFile("./.gitignore", "/**/translations.json", () => resolve());
            }
        });
    });
}
function initTranslations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configPath = yield getConfigPath();
            const fullPath = yield createConfigFile(configPath);
            console.info(`Created configation file: ${fullPath}`);
            return yield checkGitignore();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
exports.initTranslations = initTranslations;
