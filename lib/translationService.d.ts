export declare function getAuthHeaders(apiToken: string): {
    Authorization: string;
    accept: string;
};
export declare function getTranslation(apiUrl: string, apiToken: string, projectId: string, language: string): Promise<Translation>;
export interface Translation {
    language: string;
    translations: Record<string, string>;
}
