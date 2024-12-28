import { Book } from "../models/book.model.js";
import { Audiobook } from "../models/librofm.model.js";
import { LIBROFM_API_BASE, LIBROFM_API_BOOK } from "../provider-resolvers.js";
import axios from "axios";

/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export async function resolveLibroFm(isbn: string): Promise<Book> {
  const url = `${LIBROFM_API_BASE}${LIBROFM_API_BOOK}/${isbn}`;

  const response = await axios.get(url);
  try {
    if (response.status !== 200) {
      throw new Error(`Unable to get ${url}: ${response.status}`);
    }
    return standardize(response.data, isbn, url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function standardize(
  data: string,
  isbn: string,
  url: string,
): Promise<Book> {
  // Use a regular expression to extract the JSON
  const regex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
  const match = data.match(regex);
  if (!match) {
    throw new Error(`No information found for ${url}`);
  }

  const book: Audiobook = JSON.parse(match[1]);
  const standardBook = {
    title: book.name,
    authors: book.author.map((author) => author.name),
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
    isbn,
    bookProvider: "Libro.fm",
  };

  return standardBook;
}

/**
 * Formats the description by removing HTML tags and contents inside them.
 * @param {string} description - The description to be formatted.
 * @returns {string} The formatted description.
 */
export function formatDescription(description: string): string {
  if (!description) return "";
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
function extractGenres(text: string): string[] {
  const regex = /<div class="audiobook-genres">\s*([\S\s]*?)\s*<\/div>/;
  const match = text.match(regex);
  if (!match) {
    return [];
  }

  const linkRegex = /<a href="\/genres\/[^"]*">(.*?)<\/a>/g;
  const genres = [];
  let linkMatch;
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
function encodeHTML(string: string): string {
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
function stripHtmlTags(string: string): string {
  return encodeHTML(string.replaceAll(/<\/?[^>]+(>|$)/g, ""));
}
