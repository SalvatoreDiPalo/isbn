import { AxiosRequestConfig } from "axios";
import { Book } from "../models/book.model.js";
import { GoogleBook, ImageLinks } from "../models/google.model.js";
/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export declare function resolveGoogle(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {GoogleBook} book - The book object to be standardized.
 * @param {string} id - The book id.
 * @param {string} isbn - The book's ISBN.
 * @returns {Promise<Book>} The standardized book object.
 */
export declare function standardize(book: GoogleBook, id: string, isbn: string): Promise<Book>;
/**
 * Retrieves the volume information for a book.
 * @param {string} id - The book id.
 * @returns {Promise<{imageLinks?: ImageLinks, categories?: string[]}>} - A promise that resolves to an array of author names.
 * @throws {Error} - If there is an error retrieving the author information.
 */
export declare function getVolume(id: string): Promise<{
    imageLinks?: ImageLinks;
    categories?: string[];
}>;
