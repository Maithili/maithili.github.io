
export interface Project {
  id: string;
  title: string;
  category: string[];
  description: string;
  image: string;
  fullOverview?: string;
  motivation?: string;
  motivationQuote?: string;
  benchmarks?: {
    label: string;
    value: number;
    baseline?: number;
    improvement?: string;
  }[];
  contributions?: {
    icon: string;
    title: string;
    description: string;
  }[];
  citations?: {
    label: string;
    bibtex: string;
  }[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  publisher?: string;
  pdf?: string;
  vid?: string;
  image?: { src: string; alt: string };
}

export interface Update {
  date: string;
  title: string;
  description: string;
}
