"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDER_RESOLVERS = exports.DEFAULT_PROVIDERS = exports.PROVIDER_NAMES = exports.LIBROFM_API_BOOK = exports.LIBROFM_API_BASE = exports.OPENLIBRARY_API_BOOK = exports.OPENLIBRARY_API_BASE = exports.GOOGLE_BOOKS_API_BOOK = exports.GOOGLE_BOOKS_API_BASE = exports.defaultOptions = void 0;
var google_js_1 = require("./providers/google.js");
var open_library_js_1 = require("./providers/open-library.js");
var librofm_js_1 = require("./providers/librofm.js");
exports.defaultOptions = {
    timeout: 5000,
};
exports.GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
exports.GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";
exports.OPENLIBRARY_API_BASE = "https://openlibrary.org";
exports.OPENLIBRARY_API_BOOK = "/isbn";
exports.LIBROFM_API_BASE = "https://libro.fm";
exports.LIBROFM_API_BOOK = "/audiobooks";
exports.PROVIDER_NAMES = {
    GOOGLE: "google",
    OPENLIBRARY: "openlibrary",
    LIBROFM: "librofm",
};
exports.DEFAULT_PROVIDERS = [
    exports.PROVIDER_NAMES.GOOGLE,
    exports.PROVIDER_NAMES.OPENLIBRARY,
    exports.PROVIDER_NAMES.LIBROFM,
];
exports.PROVIDER_RESOLVERS = (_a = {},
    _a[exports.PROVIDER_NAMES.GOOGLE] = google_js_1.resolveGoogle,
    _a[exports.PROVIDER_NAMES.OPENLIBRARY] = open_library_js_1.resolveOpenLibrary,
    _a[exports.PROVIDER_NAMES.LIBROFM] = librofm_js_1.resolveLibroFm,
    _a);
