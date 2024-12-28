export interface Book {
    /**
     * - The ISBN of the book.
     */
    isbn: string;
    /**
     * - The title of the book.
     */
    title: string;
    /**
     * - The authors of the book.
     */
    authors: string[];
    /**
     * - The overview of the book.
     */
    description: string;
    /**
     * - The number of pages in the book.
     */
    pageCount?: number;
    /**
     * - The format of the book.
     */
    format: string;
    /**
     * - The subjects or categories of the book.
     */
    categories: string[];
    /**
     * - The publisher of the book.
     */
    publisher: string;
    /**
     * - The date the book was published.
     */
    publishedDate: string;
    /**
     * - The language of the book.
     */
    language?: string | undefined;
    /**
     * - The thumbnail image link of the book.
     */
    thumbnail?: string | undefined;
    /**
     * - The link of the book.
     */
    link?: string;
    /**
     * - The provider of the book information.
     */
    bookProvider: string;
}
