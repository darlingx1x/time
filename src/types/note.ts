export interface NoteFrontmatter {
  title?: string;
  slug?: string;
  date?: string;
  tags?: string[];
  description?: string;
  published?: boolean;
  [key: string]: any;
}

export interface Note {
  slug: string;
  title: string;
  content: string;
  html?: string;
  frontmatter: NoteFrontmatter;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface NoteApiRequest {
  slug: string;
  title: string;
  content: string;
  frontmatter: NoteFrontmatter;
  updatedAt: string;
}

export interface NoteApiResponse {
  success: boolean;
  note?: Note;
  error?: string;
} 