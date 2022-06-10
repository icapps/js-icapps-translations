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
exports.getTranslation = exports.getAuthHeaders = void 0;
const fetch = require("node-fetch");
const utils_1 = require("./utils");
function getAuthHeaders(apiToken) {
    return {
        Authorization: `Bearer ${apiToken}`,
        accept: "application/json",
    };
}
exports.getAuthHeaders = getAuthHeaders;
function getTranslation(apiUrl, apiToken, projectId, language) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${apiUrl}/${projectId}/translations/${language}`;
            console.info(`fetch translation from ${url}`);
            const res = yield fetch(url, { headers: getAuthHeaders(apiToken) });
            if (res.status !== 200)
                throw new Error(`Translation could not be retrieved from ${url}`);
            const translation = (yield res.json());
            return Object.assign(Object.assign({}, translation), { translations: (0, utils_1.makeNestedObject)(translation.translations) });
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
exports.getTranslation = getTranslation;
