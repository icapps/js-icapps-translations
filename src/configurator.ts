import { defaults, pick, isUndefined } from "lodash";
import * as fs from "fs";
import * as path from "path";
import * as inquirer from "inquirer";
import * as mkdirp from "mkdirp";
import { DEFAULT_OPTIONS, SAMPLE as sample } from "./defaults";

function fillSample(blueprint, config) {
  const mergedSample = defaults(
    pick(config, ["apiToken", "translationsPath"]),
    blueprint
  );

  return JSON.stringify(mergedSample, null, 4);
}

/**
 * Ask where the configuration should be stored
 */
function getConfigPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    const questions = [
      {
        name: "configPath",
        message: "Where should the configuration go?",
        default: "./src/_translations/config/",
      },
      {
        name: "overwriteConfig",
        message: (answers) =>
          `'${answers.configPath}' already exists. Shall we overwrite this?`,
        default: true,
        type: "confirm",
        when: (answers) => fs.existsSync(answers.configPath),
      },
    ];

    inquirer.prompt(questions, (answers) => {
      if (
        answers.overwriteConfig === true ||
        isUndefined(answers.overwriteConfig)
      ) {
        resolve(answers.configPath);
      } else {
        reject();
      }
    });
  });
}

/**
 * Create a new configuration file
 */
function createConfigFile(configurationPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      mkdirp(configurationPath);
    } catch (err) {
      reject(err);
    }

    const questions = [
      {
        name: "translationsPath",
        message: "Where should the locales go? (e.g. nl-be.json)",
        default: DEFAULT_OPTIONS.destination,
      },
      {
        name: "hasApiToken",
        message:
          "Do you already have an API Token from translations.icapps.be?",
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
      fs.writeFile(fullPath, fillSample(sample, answers), () =>
        resolve(fullPath)
      );
    });
  });
}

/**
 * Check whether .gitignore file is present and add translations.json file to it
 */
function checkGitignore(): Promise<void> {
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

/**
 * Create a new translation project
 */
export async function initTranslations() {
  try {
    const configPath = await getConfigPath();
    const fullPath = await createConfigFile(configPath);
    console.info(`Created configation file: ${fullPath}`);

    return await checkGitignore();
  } catch (error) {
    console.error(`Error: ${error}`);
    // TODO: Throw error?
  }
}
