"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTranslator = exports.replaceDynamicValues = exports.getValues = void 0;
const _ = require("lodash");
const utils_1 = require("./utils");
const translator = {};
const getValues = (language) => _.get(translator.values, language);
exports.getValues = getValues;
function replaceDynamicValues(value, dynamicValues) {
    return Object.keys(dynamicValues).reduce((prev, current) => {
        return prev.replace(new RegExp(`{{${current}}}`, "g"), dynamicValues[current]);
    }, value);
}
exports.replaceDynamicValues = replaceDynamicValues;
function initTranslator(path, defaultLocale = "en") {
    if (!translator.values) {
        translator.values = (0, utils_1.readFiles)(path);
    }
    return {
        translate: (key, language, dynamicValues = {}) => {
            const values = (0, exports.getValues)(language || defaultLocale);
            if (!values)
                throw new Error(`Translation file with language ${language} not found`);
            const translation = _.get(values, key);
            if (!translation)
                return null;
            return replaceDynamicValues(translation, dynamicValues);
        },
    };
}
exports.initTranslator = initTranslator;
