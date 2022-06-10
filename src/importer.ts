import * as fs from "fs";
import * as path from "path";
import { merge } from "lodash";
import { cleanDestination, createDestination } from "./utils";
import { Translation, getTranslation } from "./translationService";
import { DEFAULT_OPTIONS } from "./defaults";

/**
 * Save a specific translation
 */
function saveTranslation(translation: Translation, options: Options) {
  const fileName = path.join(
    options.destination,
    `${translation.language}.json`
  );
  const fileContents = `${JSON.stringify(
    translation.translations || {},
    null,
    2
  )} \n`;
  return fs.writeFileSync(fileName, fileContents);
}

/**
 * Save all translations
 */
async function saveTranslations(
  translationsResponse: Translation[],
  options: Options
) {
  for (const translation of translationsResponse) {
    saveTranslation(translation, options);
  }
}

/**
 * Start the complete import of translations
 */
export async function startImport(
  apiUrl: string,
  apiToken: string,
  projectId: string,
  languages: string,
  options: Options
) {
  try {
    const allOptions = merge({}, DEFAULT_OPTIONS, options);
    console.log(apiUrl, apiToken, projectId, languages, options);
    // Some cleaning and creating of destination folders
    createDestination(allOptions.destination);
    if (allOptions.clean) await cleanDestination(allOptions.destination);

    // Get all languages
    const languageList = languages.split(",");

    if (!languageList) throw new Error("No languages were found");

    // get for every language the translation
    const promises = languageList.map(async (language) => {
      console.info(`language: ${language}`);
      return await getTranslation(apiUrl, apiToken, projectId, language);
    });

    // Execute all promises and save translations
    const allTranslations = await Promise.all(promises);
    await saveTranslations(allTranslations, allOptions);

    console.info("All translations imported");
  } catch (error) {
    console.error(`Something wrong trying to import translations ${error}`);
    // TODO: Throw error?
  }
}

// Interfaces
export interface Options {
  destination?: string;
  clean?: boolean;
}
