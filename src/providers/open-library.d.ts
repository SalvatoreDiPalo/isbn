import { AxiosRequestConfig } from "axios";
import { Book } from "../models/book.model.js";
import { OpenLibraryBook } from "../models/open-library.model.js";
/**
 * Resolves a book from the Open Library API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
export declare function resolveOpenLibrary(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @param {string} isbn - The book's isbn.
 * @returns {Promise<Book>} - The standardized book object.
 */
export declare function standardize(book: OpenLibraryBook, isbn: string): Promise<Book>;
/**
 * Retrieves the author names from OpenLibrary.
 * @param {{key: string}[]} rawAuthors - List of author keys.
 * @returns {Promise<string[]>} - List of author names.
 */
export declare function getAuthors(rawAuthors: {
    key: string;
}[]): Promise<string[]>;
/**
 * Retrieves the description of the book from OpenLibrary.
 * @param {OpenLibraryBook} book - The book object from OpenLibrary.
 * @returns {Promise<{description: string, subjects: string[], rawAuthors: {key: string}[]}>} - Description of the book.
 */
export declare function getWorks(book: OpenLibraryBook): Promise<{
    description: string;
    subjects: string[];
    rawAuthors: {
        key: string;
    }[];
}>;
