import { resolveGoogle } from "./providers/google.js";
import { AxiosRequestConfig } from "axios";
export declare const defaultOptions: AxiosRequestConfig;
export declare const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
export declare const GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";
export declare const OPENLIBRARY_API_BASE = "https://openlibrary.org";
export declare const OPENLIBRARY_API_BOOK = "/isbn";
export declare const LIBROFM_API_BASE = "https://libro.fm";
export declare const LIBROFM_API_BOOK = "/audiobooks";
export declare const PROVIDER_NAMES: {
    GOOGLE: string;
    OPENLIBRARY: string;
    LIBROFM: string;
};
export declare const DEFAULT_PROVIDERS: string[];
export declare const PROVIDER_RESOLVERS: {
    [x: string]: typeof resolveGoogle;
};
