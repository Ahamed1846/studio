export interface Project {
  id: string;
  name: string;
  path: string;
  githubUrl?: string;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface GitHelpItem {
  question: string;
  answer: string;
}
