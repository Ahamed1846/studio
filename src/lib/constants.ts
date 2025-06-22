
import type { Project, Snippet, GitHelpItem } from "./types";

export const initialProjects: Project[] = [];

export const initialSnippets: Snippet[] = [];

export const gitHelpItems: GitHelpItem[] = [
    {
        id: 'setup-user',
        command: 'git config --global user.name "Your Name"',
        description: "Sets the name that will be attached to your commits and tags.",
    },
    {
        id: 'setup-email',
        command: 'git config --global user.email "you@example.com"',
        description: "Sets the email address that will be attached to your commits and tags.",
    },
    {
        id: 'init',
        command: 'git init',
        description: "Initializes a new Git repository in the current directory.",
        useCase: "Run this in a new or existing project folder to start tracking it with Git."
    },
    {
        id: 'clone',
        command: 'git clone <repository_url>',
        description: "Creates a local copy of a remote repository.",
        useCase: "Use this to get a full copy of a project from a URL, like from GitHub."
    },
    {
        id: 'status',
        command: 'git status',
        description: "Shows the current state of the working directory and staging area.",
        useCase: "Check which files are modified, staged, or untracked."
    },
    {
        id: 'add',
        command: 'git add <file_or_directory>',
        description: "Adds file changes from the working directory to the staging area.",
        useCase: "Use `git add .` to stage all new and modified files in the current directory."
    },
    {
        id: 'commit',
        command: 'git commit -m \"Your message\"',
        description: "Records a snapshot of the staged changes to the repository's history.",
        useCase: "Create a new commit with a descriptive message about the changes made."
    },
    {
        id: 'commit-amend',
        command: 'git commit --amend',
        description: "Replaces the most recent commit with a new commit.",
        useCase: "Useful for fixing a typo in the last commit message or adding a file you forgot."
    },
    {
        id: 'log',
        command: 'git log',
        description: "Shows the commit history for the current branch.",
        useCase: "Use `git log --oneline` for a more compact view of the history."
    },
    {
        id: 'push',
        command: 'git push <remote> <branch>',
        description: "Uploads local branch commits to the remote repository.",
        useCase: "Example: `git push origin main` pushes the local 'main' branch to the 'origin' remote."
    },
    {
        id: 'pull',
        command: 'git pull <remote> <branch>',
        description: "Fetches changes from the remote repository and merges them into the current branch.",
        useCase: "A shortcut for `git fetch` followed by `git merge`."
    },
    {
        id: 'branch-new',
        command: 'git branch <branch-name>',
        description: "Creates a new branch.",
        useCase: "Does not switch to the new branch; use `git checkout <branch-name>` for that."
    },
    {
        id: 'checkout',
        command: 'git checkout <branch-name>',
        description: "Switches to the specified branch and updates the working directory.",
        useCase: "Use `git checkout -b <new-branch>` to create and switch to a new branch in one step."
    },
    {
        id: 'merge',
        command: 'git merge <branch-name>',
        description: "Joins the specified branch's history into the current branch.",
        useCase: "Run this on `main` to merge changes from a feature branch: `git merge feature-branch`."
    },
    {
        id: 'rebase',
        command: 'git rebase <base-branch>',
        description: "Re-applies commits from your current branch onto another base branch.",
        useCase: "Often used to maintain a linear project history by moving a feature branch to the tip of `main`."
    },
    {
        id: 'reset-soft',
        command: 'git reset --soft HEAD~1',
        description: "Undoes the last commit but keeps the changes staged.",
        useCase: "Perfect for when you committed too early and want to add more changes to the same commit."
    },
    {
        id: 'reset-mixed',
        command: 'git reset HEAD~1',
        description: "Undoes the last commit and leaves the changes in your working directory (unstaged).",
        useCase: "Useful for completely changing the last commit's contents."
    },
    {
        id: 'reset-hard',
        command: 'git reset --hard HEAD~1',
        description: "Discards all changes from the last commit completely. Use with caution.",
        useCase: "When you want to permanently delete the last commit and all its changes."
    },
    {
        id: 'stash',
        command: 'git stash',
        description: "Temporarily shelves changes you've made to your working copy.",
        useCase: "Use when you need to switch branches quickly but aren't ready to commit."
    },
    {
        id: 'stash-pop',
        command: 'git stash pop',
        description: "Re-applies the most recently stashed changes and removes them from the stash list.",
        useCase: "Use `git stash apply` to re-apply changes without removing them from the stash."
    },
    {
        id: 'clean',
        command: 'git clean -fd',
        description: "Removes untracked files from your working directory. Be careful!",
        useCase: "Use `-n` for a dry run: `git clean -fdn` to see what would be deleted."
    },
    {
        id: 'reflog',
        command: 'git reflog',
        description: "Shows a log of all reference updates (e.g., switching branches, commits, resets).",
        useCase: "A powerful safety net to recover lost commits or find where you were after a bad `reset`."
    }
];


export const gitHelpItemsByCategory: Record<string, GitHelpItem[]> = {
  "⚙️ Configuration & Setup": [
    gitHelpItems.find(i => i.id === 'setup-user')!,
    gitHelpItems.find(i => i.id === 'setup-email')!,
    gitHelpItems.find(i => i.id === 'init')!,
    gitHelpItems.find(i => i.id === 'clone')!,
  ],
  "📦 Daily Workflow": [
    gitHelpItems.find(i => i.id === 'status')!,
    gitHelpItems.find(i => i.id === 'add')!,
    gitHelpItems.find(i => i.id === 'commit')!,
    gitHelpItems.find(i => i.id === 'log')!,
  ],
  "🌍 Working with Remotes": [
    gitHelpItems.find(i => i.id === 'push')!,
    gitHelpItems.find(i => i.id === 'pull')!,
  ],
  "🌳 Branching & Merging": [
    gitHelpItems.find(i => i.id === 'branch-new')!,
    gitHelpItems.find(i => i.id === 'checkout')!,
    gitHelpItems.find(i => i.id === 'merge')!,
    gitHelpItems.find(i => i.id === 'rebase')!,
  ],
  "🧹 Cleanup & Undoing Changes": [
    gitHelpItems.find(i => i.id === 'commit-amend')!,
    gitHelpItems.find(i => i.id === 'reset-soft')!,
    gitHelpItems.find(i => i.id === 'reset-mixed')!,
    gitHelpItems.find(i => i.id === 'reset-hard')!,
    gitHelpItems.find(i => i.id === 'stash')!,
    gitHelpItems.find(i => i.id === 'stash-pop')!,
    gitHelpItems.find(i => i.id === 'clean')!,
    gitHelpItems.find(i => i.id === 'reflog')!,
  ]
};
