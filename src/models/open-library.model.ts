export interface OpenLibraryBook {
  identifiers: object;
  title: string;
  authors: Author[];
  publish_date: string;
  publishers: string[];
  covers: number[];
  contributions: string[];
  languages: Language[];
  source_records: string[];
  local_id: string[];
  type: Type;
  first_sentence: FirstSentence;
  key: string;
  number_of_pages: number;
  works: Work[];
  classifications: object;
  ocaid: string;
  isbn_10: string[];
  isbn_13: string[];
  latest_revision: number;
  revision: number;
  created: DateTime;
  last_modified: DateTime;
}

export interface Author {
  key: string;
}

export interface Language {
  key: string;
}

export interface Type {
  key: string;
}

export interface FirstSentence {
  type: string;
  value: string;
}

export interface Work {
  key: string;
}

export interface DateTime {
  type: string;
  value: string;
}

export interface OpenLibraryResponse {
  description: string;
  subjects: string[];
  authors: { author: { key: string } }[];
}
