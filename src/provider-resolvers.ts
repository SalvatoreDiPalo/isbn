import { resolveGoogle } from "./providers/google.js";
import { resolveOpenLibrary } from "./providers/open-library.js";
import { resolveLibroFm } from "./providers/librofm.js";
import { AxiosRequestConfig } from "axios";

export const defaultOptions: AxiosRequestConfig = {
  timeout: 5000,
};

export const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
export const GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";

export const OPENLIBRARY_API_BASE = "https://openlibrary.org";
export const OPENLIBRARY_API_BOOK = "/isbn";

export const LIBROFM_API_BASE = "https://libro.fm";
export const LIBROFM_API_BOOK = "/audiobooks";

export const PROVIDER_NAMES = {
  GOOGLE: "google",
  OPENLIBRARY: "openlibrary",
  LIBROFM: "librofm",
};

export const DEFAULT_PROVIDERS = [
  PROVIDER_NAMES.GOOGLE,
  PROVIDER_NAMES.OPENLIBRARY,
  PROVIDER_NAMES.LIBROFM,
];

export const PROVIDER_RESOLVERS = {
  [PROVIDER_NAMES.GOOGLE]: resolveGoogle,
  [PROVIDER_NAMES.OPENLIBRARY]: resolveOpenLibrary,
  [PROVIDER_NAMES.LIBROFM]: resolveLibroFm,
};
