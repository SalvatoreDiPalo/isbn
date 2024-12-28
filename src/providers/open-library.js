"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOpenLibrary = resolveOpenLibrary;
exports.standardize = standardize;
exports.getAuthors = getAuthors;
exports.getWorks = getWorks;
var axios_1 = require("axios");
var provider_resolvers_js_1 = require("../provider-resolvers.js");
/**
 * Resolves a book from the Open Library API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
function resolveOpenLibrary(isbn, options) {
    return __awaiter(this, void 0, void 0, function () {
        var requestOptions, url, response, book, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestOptions = __assign(__assign({}, provider_resolvers_js_1.defaultOptions), options);
                    url = "".concat(provider_resolvers_js_1.OPENLIBRARY_API_BASE).concat(provider_resolvers_js_1.OPENLIBRARY_API_BOOK, "/").concat(isbn, ".json");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(url, requestOptions)];
                case 2:
                    response = _a.sent();
                    if (response.status !== 200) {
                        throw new Error("Wrong response code: ".concat(response.status));
                    }
                    book = response.data;
                    if (!book || Object.keys(book).length === 0) {
                        throw new Error("No books found with ISBN: ".concat(isbn));
                    }
                    return [4 /*yield*/, standardize(book, isbn)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_1 = _a.sent();
                    throw new Error(error_1.message);
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @param {string} isbn - The book's isbn.
 * @returns {Promise<Book>} - The standardized book object.
 */
function standardize(book, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, description, subjects, rawAuthors, authors, standardBook;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getWorks(book)];
                case 1:
                    _a = _c.sent(), description = _a.description, subjects = _a.subjects, rawAuthors = _a.rawAuthors;
                    return [4 /*yield*/, getAuthors(rawAuthors)];
                case 2:
                    authors = _c.sent();
                    standardBook = {
                        title: book.title,
                        authors: authors,
                        description: description,
                        pageCount: book.number_of_pages,
                        format: "book",
                        categories: subjects,
                        thumbnail: "https://covers.openlibrary.org/b/id/".concat(book.covers[0], "-L.jpg"),
                        link: book.key
                            ? "".concat(provider_resolvers_js_1.OPENLIBRARY_API_BASE).concat(book.key)
                            : "".concat(provider_resolvers_js_1.OPENLIBRARY_API_BASE).concat(provider_resolvers_js_1.OPENLIBRARY_API_BOOK, "/").concat(isbn),
                        publisher: (_b = book.publishers) === null || _b === void 0 ? void 0 : _b.join(", "),
                        publishedDate: book.publish_date,
                        language: formatLanguage(book.languages),
                        isbn: isbn,
                        bookProvider: "Open Library",
                    };
                    return [2 /*return*/, standardBook];
            }
        });
    });
}
/**
 * Retrieves the author names from OpenLibrary.
 * @param {{key: string}[]} rawAuthors - List of author keys.
 * @returns {Promise<string[]>} - List of author names.
 */
function getAuthors(rawAuthors) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = rawAuthors
                        .filter(function (author) { return author && author.key; })
                        .map(function (author) {
                        return axios_1.default
                            .get("https://openlibrary.org/".concat(author.key, ".json"))
                            .then(function (response) {
                            if (response.status !== 200) {
                                throw new Error("Unable to get author ".concat(author.key, ": ").concat(response.status));
                            }
                            return response.data && response.data.name;
                        });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    throw new Error(error_2.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieves the description of the book from OpenLibrary.
 * @param {OpenLibraryBook} book - The book object from OpenLibrary.
 * @returns {Promise<{description: string, subjects: string[], rawAuthors: {key: string}[]}>} - Description of the book.
 */
function getWorks(book) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultResponse, work, response, data, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaultResponse = {
                        description: "",
                        subjects: [],
                        rawAuthors: [],
                    };
                    if (!book.works) {
                        return [2 /*return*/, defaultResponse];
                    }
                    work = book.works[0];
                    if (!work || !work.key) {
                        return [2 /*return*/, defaultResponse];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("https://openlibrary.org/".concat(work.key, ".json"))];
                case 2:
                    response = _b.sent();
                    if (response.status !== 200) {
                        throw new Error("Unable to get ".concat(work.key, ": ").concat(response.status));
                    }
                    data = response.data;
                    return [2 /*return*/, {
                            description: data.description || "",
                            subjects: data.subjects || [],
                            rawAuthors: ((_a = data.authors) === null || _a === void 0 ? void 0 : _a.map(function (a) { return a.author; })) || [],
                        }];
                case 3:
                    error_3 = _b.sent();
                    throw new Error(error_3.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Formats the language codes from Open Library API to their corresponding ISO 639-1 codes.
 * @param {Language[]} languages - An array of language codes from Open Library API.
 * @returns {string | undefined} - A new language map object with ISO 639-1 codes as keys and language codes as values.
 */
function formatLanguage(languages) {
    if (!languages || languages.length === 0) {
        return;
    }
    /**
     * Mapping of Open Library language codes to their corresponding language names.
     * https://openlibrary.org/languages.json
     * @type {{ [key: string]: string } } - A new language map object with ISO 639-1 codes as keys and language codes as values.
     */
    var newLanguageMap = {
        "/languages/eng": "en",
        "/languages/spa": "es",
        "/languages/fre": "fr",
        "/languages/ger": "de",
        "/languages/rus": "ru",
        "/languages/ita": "it",
        "/languages/chi": "zh",
        "/languages/jpn": "ja",
        "/languages/por": "pt",
        "/languages/ara": "ar",
        "/languages/heb": "he",
        "/languages/kor": "ko",
        "/languages/pol": "pl",
        "/languages/dut": "nl",
        "/languages/lat": "la",
    };
    return newLanguageMap[languages[0].key] || undefined;
}
