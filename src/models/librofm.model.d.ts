export interface Audiobook {
    url: string;
    bookFormat: string;
    name: string;
    description: string;
    isbn: string;
    image: string;
    abridged: string;
    author: Person[];
    readBy: Person[];
    publisher: string;
    datePublished: string;
    inLanguage: string;
    duration: string;
    regionsAllowed: string[];
    offers: object;
    workExample: object;
}
export interface Person {
    name: string;
}
