import type { Project, Snippet, GitHelpItem } from "./types";

export const initialProjects: Project[] = [];

export const initialSnippets: Snippet[] = [];

export const gitHelpItems: GitHelpItem[] = [
    {
        question: "How to set up Git for the first time?",
        answer: `git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"`,
    },
    {
        question: "How to create a new local repository?",
        answer: `git init`,
    },
    {
        question: "How to clone an existing repository?",
        answer: `git clone <repository_url>`,
    },
    {
        question: "How to check the status of your files?",
        answer: `git status`,
    },
    {
        question: "How to add files to the staging area?",
        answer: `git add <file_name>  # Add a specific file
git add .           # Add all new and changed files`,
    },
    {
        question: "How to commit your staged changes?",
        answer: `git commit -m "Your descriptive commit message"`,
    },
    {
        question: "How to push your committed changes to a remote repository?",
        answer: `git push <remote_name> <branch_name>
git push origin main # Example`,
    },
    {
        question: "How to pull changes from a remote repository?",
        answer: `git pull <remote_name> <branch_name>`,
    },
    {
        question: "How to view the commit history?",
        answer: `git log
git log --oneline # For a condensed view`,
    },
    {
        question: "How to create a new branch?",
        answer: `git branch <new_branch_name>`,
    },
    {
        question: "How to switch to a different branch?",
        answer: `git checkout <branch_name>
git switch <branch_name> # Newer syntax`,
    },
    {
        question: "How to create and switch to a new branch in one command?",
        answer: `git checkout -b <new_branch_name>
git switch -c <new_branch_name> # Newer syntax`,
    },
    {
        question: "How to merge a branch into your current branch?",
        answer: `git merge <branch_to_merge>`,
    },
    {
        question: "How to discard changes in your working directory?",
        answer: `git checkout -- <file_name> # Discard changes in a specific file
git clean -fdx              # Remove all untracked files and directories`,
    },
    {
        question: "How to undo your last commit?",
        answer: `git reset --soft HEAD~1 # Keeps changes staged
git reset --mixed HEAD~1 # Default, keeps changes in working directory but unstaged
git reset --hard HEAD~1 # Discards all changes`,
    },
];
