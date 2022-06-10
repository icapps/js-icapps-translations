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
exports.startImport = void 0;
const fs = require("fs");
const path = require("path");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const translationService_1 = require("./translationService");
const defaults_1 = require("./defaults");
function saveTranslation(translation, options) {
    const fileName = path.join(options.destination, `${translation.language}.json`);
    const fileContents = `${JSON.stringify(translation.translations || {}, null, 2)} \n`;
    return fs.writeFileSync(fileName, fileContents);
}
function saveTranslations(translationsResponse, options) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const translation of translationsResponse) {
            saveTranslation(translation, options);
        }
    });
}
function startImport(apiUrl, apiToken, projectId, languages, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allOptions = (0, lodash_1.merge)({}, defaults_1.DEFAULT_OPTIONS, options);
            console.log(apiUrl, apiToken, projectId, languages, options);
            (0, utils_1.createDestination)(allOptions.destination);
            if (allOptions.clean)
                yield (0, utils_1.cleanDestination)(allOptions.destination);
            const languageList = languages.split(",");
            if (!languageList)
                throw new Error("No languages were found");
            const promises = languageList.map((language) => __awaiter(this, void 0, void 0, function* () {
                console.info(`language: ${language}`);
                return yield (0, translationService_1.getTranslation)(apiUrl, apiToken, projectId, language);
            }));
            const allTranslations = yield Promise.all(promises);
            yield saveTranslations(allTranslations, allOptions);
            console.info("All translations imported");
        }
        catch (error) {
            console.error(`Something wrong trying to import translations ${error}`);
        }
    });
}
exports.startImport = startImport;
