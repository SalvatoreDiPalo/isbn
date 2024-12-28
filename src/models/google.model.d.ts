export interface GoogleBook {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: object[];
    readingModes: object;
    pageCount: number;
    printType: string;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: object;
    imageLinks: ImageLinks;
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
    saleInfo: string;
    accessInfo: string;
    searchInfo: string;
}
export interface ImageLinks {
    extraLarge: string;
    large: string;
    medium: string;
    small: string;
    thumbnail: string;
    smallThumbnail: string;
}
