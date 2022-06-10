import * as fetch from "node-fetch";
import { makeNestedObject } from "./utils";

/**
 * Get the Authorization header needed for calls
 */
export function getAuthHeaders(apiToken: string): {
  Authorization: string;
  accept: string;
} {
  return {
    Authorization: `Bearer ${apiToken}`,
    accept: "application/json",
  };
}

/**
 * Get a translation via their shortname
 */
export async function getTranslation(
  apiUrl: string,
  apiToken: string,
  projectId: string,
  language: string
): Promise<Translation> {
  try {
    const url = `${apiUrl}/${projectId}/translations/${language}`;
    console.info(`fetch translation from ${url}`);

    const res = await fetch(url, { headers: getAuthHeaders(apiToken) });
    if (res.status !== 200)
      throw new Error(`Translation could not be retrieved from ${url}`);

    const translation = (await res.json()) as Translation;
    return {
      ...translation,
      translations: makeNestedObject(translation.translations),
    };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export interface Translation {
  language: string;
  translations: Record<string, string>;
}
