"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTranslator = exports.init = exports.import = void 0;
var importer_1 = require("./importer");
Object.defineProperty(exports, "import", { enumerable: true, get: function () { return importer_1.startImport; } });
var configurator_1 = require("./configurator");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return configurator_1.initTranslations; } });
var translator_1 = require("./translator");
Object.defineProperty(exports, "initTranslator", { enumerable: true, get: function () { return translator_1.initTranslator; } });
