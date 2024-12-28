"use strict";
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
exports.resolveLibroFm = resolveLibroFm;
exports.standardize = standardize;
exports.formatDescription = formatDescription;
var provider_resolvers_js_1 = require("../provider-resolvers.js");
var axios_1 = require("axios");
/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
function resolveLibroFm(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(provider_resolvers_js_1.LIBROFM_API_BASE).concat(provider_resolvers_js_1.LIBROFM_API_BOOK, "/").concat(isbn);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    try {
                        if (response.status !== 200) {
                            throw new Error("Unable to get ".concat(url, ": ").concat(response.status));
                        }
                        return [2 /*return*/, standardize(response.data, isbn, url)];
                    }
                    catch (error) {
                        throw new Error(error.message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function standardize(data, isbn, url) {
    return __awaiter(this, void 0, void 0, function () {
        var regex, match, book, standardBook;
        return __generator(this, function (_a) {
            regex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
            match = data.match(regex);
            if (!match) {
                throw new Error("No information found for ".concat(url));
            }
            book = JSON.parse(match[1]);
            standardBook = {
                title: book.name,
                authors: book.author.map(function (author) { return author.name; }),
                description: formatDescription(book.description),
                format: book.bookFormat.includes("Audiobook")
                    ? "audiobook"
                    : book.bookFormat,
                categories: extractGenres(data),
                thumbnail: book.image,
                link: book.url,
                publisher: book.publisher,
                publishedDate: book.datePublished,
                language: book.inLanguage,
                isbn: isbn,
                bookProvider: "Libro.fm",
            };
            return [2 /*return*/, standardBook];
        });
    });
}
/**
 * Formats the description by removing HTML tags and contents inside them.
 * @param {string} description - The description to be formatted.
 * @returns {string} The formatted description.
 */
function formatDescription(description) {
    if (!description)
        return "";
    // Replace <br> with a space
    description = description.replaceAll("<br>", " ");
    // Replace <b>—</b> with a dash
    description = description.replaceAll("<b>—</b>", "—");
    // Remove bold tags and contents
    description = description.replaceAll(/<b>.*?<\/b>/g, "");
    // Strip HTML tags
    description = stripHtmlTags(description);
    // Trim
    description = description.trim();
    // Remove extra spaces
    description = description.replaceAll(/\s{2,}/g, " ");
    return description;
}
/**
 * Extracts the genres from the given text.
 * @param {string} text - The text to extract genres from.
 * @returns {string[]} The extracted genres.
 */
function extractGenres(text) {
    var regex = /<div class="audiobook-genres">\s*([\S\s]*?)\s*<\/div>/;
    var match = text.match(regex);
    if (!match) {
        return [];
    }
    var linkRegex = /<a href="\/genres\/[^"]*">(.*?)<\/a>/g;
    var genres = [];
    var linkMatch;
    while ((linkMatch = linkRegex.exec(match[1])) !== null) {
        genres.push(linkMatch[1]);
    }
    return genres;
}
/**
 * Encodes HTML special characters to prevent XSS attacks.
 * @param {string} string - The string to encode.
 * @returns {string} - The encoded string.
 */
function encodeHTML(string) {
    return string
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('" ', "” ")
        .replaceAll(' "', "“ ")
        .replaceAll("'", "&#39;");
}
/**
 * Removes HTML tags from a string and encodes it to prevent XSS attacks.
 * @param {string} string - The string from which to remove HTML tags.
 * @returns {string} - The sanitized string without HTML tags.
 */
function stripHtmlTags(string) {
    return encodeHTML(string.replaceAll(/<\/?[^>]+(>|$)/g, ""));
}
