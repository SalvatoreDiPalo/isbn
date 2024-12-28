import { AxiosRequestConfig } from "axios";
import {
  PROVIDER_NAMES,
  DEFAULT_PROVIDERS,
  PROVIDER_RESOLVERS,
} from "./provider-resolvers.js";
import { Book } from "./models/book.model.js";

export default class Isbn {
  /**
   * @type {Providers}
   */
  _providers = DEFAULT_PROVIDERS;

  PROVIDER_NAMES: typeof PROVIDER_NAMES;

  constructor() {
    this.PROVIDER_NAMES = PROVIDER_NAMES;
  }

  provider(providers: string[]): this {
    if (!Array.isArray(providers)) {
      throw new TypeError("`providers` must be an array.");
    }

    if (providers.length === 0) {
      return this;
    }

    const unsupportedProviders = providers.filter(
      (p) => !DEFAULT_PROVIDERS.includes(p),
    );
    if (unsupportedProviders.length > 0) {
      throw new Error(
        `Unsupported providers: ${unsupportedProviders.join(", ")}`,
      );
    }

    this._providers = [...new Set(providers)];
    return this;
  }

  /**
   * Resolves the book information for the given ISBN.
   * @param {string} isbn - The ISBN of the book.
   * @param {AxiosRequestConfig} options - The options for the request.
   * @returns {Promise<Book>} - A Promise that resolves to the book information.
   * @throws {Error} - If an error occurs while resolving the book information.
   */
  async resolve(isbn: string, options: AxiosRequestConfig = {}): Promise<Book> {
    const messages = [];
    for (const provider of this._providers) {
      try {
        return await PROVIDER_RESOLVERS[provider](isbn, options);
      } catch (error) {
        if (error.message) messages.push(`${provider}: ${error.message}`);
      }
    }
    // If none of the providers worked, we throw an error.
    throw new Error(
      `All providers failed${
        messages.length > 0 ? `\n${messages.join("\n")}` : ""
      }`,
    );
  }
}
