export declare function startImport(apiUrl: string, apiToken: string, projectId: string, languages: string, options: Options): Promise<void>;
export interface Options {
    destination?: string;
    clean?: boolean;
}
