export interface Script {
  id: string;
  name: string;
  command: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  githubUrl?: string;
  tags: string[];
  scripts: Script[];
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
}

export interface GitHelpItem {
  question: string;
  answer: string;
}

export interface DevDockData {
  projects: Project[];
  snippets: Snippet[];
}
