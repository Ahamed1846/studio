

export interface Script {
  id: string;
  name: string;
  command: string;
}

export interface Project {
  id:string;
  name: string;
  path: string;
  githubUrl?: string;
  tags: string[];
  scripts: Script[];
  notes?: string;
  isPinned?: boolean;
  lastModified: string;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned?: boolean;
}

export interface GitHelpItem {
  id: string;
  command: string;
  description: string;
  useCase?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  message: string;
}

export interface DevDockData {
  projects: Project[];
  snippets: Snippet[];
  activityLog?: ActivityLogItem[];
}
