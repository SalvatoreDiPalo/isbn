import { Book } from "../models/book.model.js";
/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export declare function resolveLibroFm(isbn: string): Promise<Book>;
export declare function standardize(data: string, isbn: string, url: string): Promise<Book>;
/**
 * Formats the description by removing HTML tags and contents inside them.
 * @param {string} description - The description to be formatted.
 * @returns {string} The formatted description.
 */
export declare function formatDescription(description: string): string;
