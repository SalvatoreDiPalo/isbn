import axios, { AxiosRequestConfig } from "axios";
import {
  defaultOptions,
  OPENLIBRARY_API_BASE,
  OPENLIBRARY_API_BOOK,
} from "../provider-resolvers.js";
import { Book } from "../models/book.model.js";
import {
  Language,
  OpenLibraryBook,
  OpenLibraryResponse,
} from "../models/open-library.model.js";

/**
 * Resolves a book from the Open Library API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
export async function resolveOpenLibrary(
  isbn: string,
  options: AxiosRequestConfig,
): Promise<Book> {
  const requestOptions = {
    ...defaultOptions,
    ...options,
  };
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}/${isbn}.json`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const book = response.data;
    if (!book || Object.keys(book).length === 0) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    return await standardize(book, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @param {string} isbn - The book's isbn.
 * @returns {Promise<Book>} - The standardized book object.
 */
export async function standardize(
  book: OpenLibraryBook,
  isbn: string,
): Promise<Book> {
  const { description, subjects, rawAuthors } = await getWorks(book);
  const authors = await getAuthors(rawAuthors);
  const standardBook = {
    title: book.title,
    authors,
    description,
    pageCount: book.number_of_pages,
    format: "book",
    categories: subjects,
    thumbnail: `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`,
    link: book.key
      ? `${OPENLIBRARY_API_BASE}${book.key}`
      : `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}/${isbn}`,
    publisher: book.publishers?.join(", "),
    publishedDate: book.publish_date,
    language: formatLanguage(book.languages),
    isbn,
    bookProvider: "Open Library",
  };

  return standardBook;
}

/**
 * Retrieves the author names from OpenLibrary.
 * @param {{key: string}[]} rawAuthors - List of author keys.
 * @returns {Promise<string[]>} - List of author names.
 */
export async function getAuthors(
  rawAuthors: { key: string }[],
): Promise<string[]> {
  const promises = rawAuthors
    .filter((author) => author && author.key)
    .map((author) =>
      axios
        .get(`https://openlibrary.org/${author.key}.json`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(
              `Unable to get author ${author.key}: ${response.status}`,
            );
          }
          return response.data && response.data.name;
        }),
    );

  try {
    return await Promise.all(promises);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Retrieves the description of the book from OpenLibrary.
 * @param {OpenLibraryBook} book - The book object from OpenLibrary.
 * @returns {Promise<{description: string, subjects: string[], rawAuthors: {key: string}[]}>} - Description of the book.
 */
export async function getWorks(book: OpenLibraryBook): Promise<{
  description: string;
  subjects: string[];
  rawAuthors: { key: string }[];
}> {
  const defaultResponse = {
    description: "",
    subjects: [],
    rawAuthors: [],
  };

  if (!book.works) {
    return defaultResponse;
  }

  const [work] = book.works;

  if (!work || !work.key) {
    return defaultResponse;
  }

  try {
    const response = await axios.get(
      `https://openlibrary.org/${work.key}.json`,
    );

    if (response.status !== 200) {
      throw new Error(`Unable to get ${work.key}: ${response.status}`);
    }

    const data: OpenLibraryResponse = response.data;

    return {
      description: data.description || "",
      subjects: data.subjects || [],
      rawAuthors: data.authors?.map((a) => a.author) || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Formats the language codes from Open Library API to their corresponding ISO 639-1 codes.
 * @param {Language[]} languages - An array of language codes from Open Library API.
 * @returns {string | undefined} - A new language map object with ISO 639-1 codes as keys and language codes as values.
 */
function formatLanguage(languages: Language[]): string | undefined {
  if (!languages || languages.length === 0) {
    return;
  }
  /**
   * Mapping of Open Library language codes to their corresponding language names.
   * https://openlibrary.org/languages.json
   * @type {{ [key: string]: string } } - A new language map object with ISO 639-1 codes as keys and language codes as values.
   */
  const newLanguageMap: { [key: string]: string } = {
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
