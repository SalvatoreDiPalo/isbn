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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGoogle = resolveGoogle;
exports.standardize = standardize;
exports.getVolume = getVolume;
var axios_1 = require("axios");
var provider_resolvers_js_1 = require("../provider-resolvers.js");
/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
function resolveGoogle(isbn, options) {
    return __awaiter(this, void 0, void 0, function () {
        var requestOptions, url, response, books, book, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestOptions = __assign(__assign({}, provider_resolvers_js_1.defaultOptions), options);
                    url = "".concat(provider_resolvers_js_1.GOOGLE_BOOKS_API_BASE).concat(provider_resolvers_js_1.GOOGLE_BOOKS_API_BOOK, "?q=isbn:").concat(isbn);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(url, requestOptions)];
                case 2:
                    response = _a.sent();
                    if (response.status !== 200) {
                        throw new Error("Wrong response code: ".concat(response.status));
                    }
                    books = response.data;
                    if (!books.totalItems) {
                        throw new Error("No books found with isbn: ".concat(isbn));
                    }
                    // In very rare circumstances books.items[0] is undefined (see #2)
                    if (!books.items || books.items.length === 0) {
                        throw new Error("No volume info found for book with isbn: ".concat(isbn));
                    }
                    book = books.items[0];
                    return [4 /*yield*/, standardize(book.volumeInfo, book.id, isbn)];
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
 * @param {GoogleBook} book - The book object to be standardized.
 * @param {string} id - The book id.
 * @param {string} isbn - The book's ISBN.
 * @returns {Promise<Book>} The standardized book object.
 */
function standardize(book, id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, imageLinks, _c, categories, standardBook;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, getVolume(id)];
                case 1:
                    _a = _e.sent(), _b = _a.imageLinks, imageLinks = _b === void 0 ? book.imageLinks : _b, _c = _a.categories, categories = _c === void 0 ? book.categories : _c;
                    standardBook = {
                        title: book.title,
                        authors: book.authors,
                        description: book.description,
                        pageCount: book.pageCount,
                        format: (_d = book.printType) === null || _d === void 0 ? void 0 : _d.toLowerCase(),
                        categories: formatCategories(categories),
                        thumbnail: getLargestThumbnail(imageLinks),
                        link: book.canonicalVolumeLink,
                        publisher: book.publisher,
                        publishedDate: book.publishedDate,
                        language: book.language,
                        isbn: isbn,
                        bookProvider: "Google Books",
                    };
                    return [2 /*return*/, standardBook];
            }
        });
    });
}
/**
 * Retrieves the volume information for a book.
 * @param {string} id - The book id.
 * @returns {Promise<{imageLinks?: ImageLinks, categories?: string[]}>} - A promise that resolves to an array of author names.
 * @throws {Error} - If there is an error retrieving the author information.
 */
function getVolume(id) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "".concat(provider_resolvers_js_1.GOOGLE_BOOKS_API_BASE).concat(provider_resolvers_js_1.GOOGLE_BOOKS_API_BOOK, "/").concat(id);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.status !== 200) {
                        throw new Error("Unable to get volume ".concat(id, ": ").concat(response.status));
                    }
                    return [2 /*return*/, __assign({}, response.data.volumeInfo)];
                case 2:
                    error_2 = _a.sent();
                    throw new Error(error_2.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the largest available thumbnail from a book's image links.
 * @param {ImageLinks} [imageLinks] - The image links object.
 * @returns {string|undefined} The URL of the largest thumbnail, or undefined if not found.
 */
function getLargestThumbnail(imageLinks) {
    var sizes = [
        "extraLarge",
        "smallThumbnail",
        "large",
        "medium",
        "small",
        "thumbnail",
    ];
    if (!imageLinks)
        return;
    var size = sizes.find(function (size) { return size in imageLinks; });
    // @ts-ignore
    return removeQueryParameter(imageLinks[size], "imgtk");
}
/**
 * Removes a query parameter from a URL.
 * @param {string} url - The URL.
 * @param {string} parameter - The query parameter to remove.
 * @returns {string | undefined} The URL with the query parameter removed.
 */
function removeQueryParameter(url, parameter) {
    var urlObject = new URL(url);
    urlObject.searchParams.delete(parameter);
    return urlObject.toString();
}
/**
 * Formats the categories array.
 * @param {string[]} categories - The array of categories.
 * @returns {string[]} The formatted categories array.
 */
function formatCategories(categories) {
    if (!categories || categories.length === 0)
        return [];
    var firstCategory = categories[0];
    return firstCategory.includes("/")
        ? __spreadArray([firstCategory.split("/")[0].trim()], categories, true) : categories;
}
