import axios, { AxiosRequestConfig } from "axios";
import {
  defaultOptions,
  GOOGLE_BOOKS_API_BASE,
  GOOGLE_BOOKS_API_BOOK,
} from "../provider-resolvers.js";
import { Book } from "../models/book.model.js";
import { GoogleBook, ImageLinks } from "../models/google.model.js";

/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export async function resolveGoogle(
  isbn: string,
  options: AxiosRequestConfig,
): Promise<Book> {
  const requestOptions = {
    ...defaultOptions,
    ...options,
  };
  const url = `${GOOGLE_BOOKS_API_BASE}${GOOGLE_BOOKS_API_BOOK}?q=isbn:${isbn}`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const books = response.data;
    if (!books.totalItems) {
      throw new Error(`No books found with isbn: ${isbn}`);
    }
    // In very rare circumstances books.items[0] is undefined (see #2)
    if (!books.items || books.items.length === 0) {
      throw new Error(`No volume info found for book with isbn: ${isbn}`);
    }
    const book = books.items[0];
    return await standardize(book.volumeInfo, book.id, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {GoogleBook} book - The book object to be standardized.
 * @param {string} id - The book id.
 * @param {string} isbn - The book's ISBN.
 * @returns {Promise<Book>} The standardized book object.
 */
export async function standardize(
  book: GoogleBook,
  id: string,
  isbn: string,
): Promise<Book> {
  const { imageLinks = book.imageLinks, categories = book.categories } =
    await getVolume(id);

  const standardBook = {
    title: book.title,
    authors: book.authors,
    description: book.description,
    pageCount: book.pageCount,
    format: book.printType?.toLowerCase(),
    categories: formatCategories(categories),
    thumbnail: getLargestThumbnail(imageLinks),
    link: book.canonicalVolumeLink,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    language: book.language,
    isbn,
    bookProvider: "Google Books",
  };

  return standardBook;
}

/**
 * Retrieves the volume information for a book.
 * @param {string} id - The book id.
 * @returns {Promise<{imageLinks?: ImageLinks, categories?: string[]}>} - A promise that resolves to an array of author names.
 * @throws {Error} - If there is an error retrieving the author information.
 */
export async function getVolume(
  id: string,
): Promise<{ imageLinks?: ImageLinks; categories?: string[] }> {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}${GOOGLE_BOOKS_API_BOOK}/${id}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Unable to get volume ${id}: ${response.status}`);
    }
    return {
      ...response.data.volumeInfo,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the largest available thumbnail from a book's image links.
 * @param {ImageLinks} [imageLinks] - The image links object.
 * @returns {string|undefined} The URL of the largest thumbnail, or undefined if not found.
 */
function getLargestThumbnail(imageLinks: ImageLinks): string | undefined {
  const sizes = [
    "extraLarge",
    "smallThumbnail",
    "large",
    "medium",
    "small",
    "thumbnail",
  ];

  if (!imageLinks) return;

  const size = sizes.find((size) => size in imageLinks);

  // @ts-ignore
  return removeQueryParameter(imageLinks[size], "imgtk");
}

/**
 * Removes a query parameter from a URL.
 * @param {string} url - The URL.
 * @param {string} parameter - The query parameter to remove.
 * @returns {string | undefined} The URL with the query parameter removed.
 */
function removeQueryParameter(
  url: string,
  parameter: string,
): string | undefined {
  const urlObject = new URL(url);
  urlObject.searchParams.delete(parameter);
  return urlObject.toString();
}

/**
 * Formats the categories array.
 * @param {string[]} categories - The array of categories.
 * @returns {string[]} The formatted categories array.
 */
function formatCategories(categories: string[]): string[] {
  if (!categories || categories.length === 0) return [];

  const [firstCategory] = categories;
  return firstCategory.includes("/")
    ? [firstCategory.split("/")[0].trim(), ...categories]
    : categories;
}
