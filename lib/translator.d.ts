export declare const getValues: (language: string) => string;
export declare function replaceDynamicValues(value: string, dynamicValues: {
    [key: string]: string;
}): string;
export declare function initTranslator(path: string, defaultLocale?: string): ITranslator;
export interface ITranslator {
    translate: (key: string, language?: string, dynamicValues?: {
        [key: string]: string;
    }) => string;
}
