"use client";

import { Octokit } from "@octokit/rest";
import { useEffect, useState, useMemo } from "react";
import { GitCommit, Star, GitFork, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type Commit = {
  sha: string;
  message: string;
  author: string | undefined;
  date: string;
  html_url: string;
};

type RepoInfo = {
  stars: number;
  forks: number;
  default_branch: string;
  open_issues_count: number;
};

type GitHubInsightsProps = {
  githubUrl: string;
};

const octokit = new Octokit();

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") return null;
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) {
      return { owner: pathParts[0], repo: pathParts[1].replace('.git', '') };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function GitHubInsights({ githubUrl }: GitHubInsightsProps) {
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parsedUrl = useMemo(() => parseGitHubUrl(githubUrl), [githubUrl]);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!parsedUrl) {
        setError("Invalid GitHub URL format.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const { owner, repo } = parsedUrl;

      try {
        const [repoRes, commitsRes] = await Promise.all([
          octokit.repos.get({ owner, repo }),
          octokit.repos.listCommits({ owner, repo, per_page: 5 }),
        ]);

        if (repoRes.status === 200) {
          setRepoInfo({
            stars: repoRes.data.stargazers_count,
            forks: repoRes.data.forks_count,
            default_branch: repoRes.data.default_branch,
            open_issues_count: repoRes.data.open_issues_count,
          });
        }

        if (commitsRes.status === 200) {
          const formattedCommits = commitsRes.data.map((c) => ({
            sha: c.sha,
            message: c.commit.message.split("\n")[0],
            author: c.author?.login || c.commit.author?.name,
            date: c.commit.author?.date ? formatDistanceToNow(new Date(c.commit.author.date), { addSuffix: true }) : "N/A",
            html_url: c.html_url,
          }));
          setCommits(formattedCommits);
        }
      } catch (err: any) {
        if (err.status === 404) {
          setError("Repository not found. It might be private or deleted.");
        } else if (err.status === 403) {
            setError("API rate limit exceeded. Please try again later.");
        } else {
          setError("Failed to fetch GitHub data.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [parsedUrl]);

  if (loading) {
    return (
      <div className="space-y-4 px-2 py-1">
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 rounded-full mt-1" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive p-2 bg-destructive/10 rounded-md">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (!repoInfo || !commits) {
    return null;
  }

  return (
    <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
                <Badge variant="outline">
                    Branch: {repoInfo.default_branch}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground" title={`${repoInfo.stars} stars`}>
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>{new Intl.NumberFormat().format(repoInfo.stars)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground" title={`${repoInfo.forks} forks`}>
                    <GitFork className="h-4 w-4" />
                    <span>{new Intl.NumberFormat().format(repoInfo.forks)}</span>
                </div>
            </div>
             <a href={`${githubUrl}/pulls`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                {new Intl.NumberFormat().format(repoInfo.open_issues_count)} open PRs/Issues
            </a>
        </div>
      
      <div>
        <h5 className="mb-2 font-semibold text-foreground">Recent Commits</h5>
        <ul className="space-y-3">
          {commits.map((commit) => (
            <li key={commit.sha} className="flex items-start gap-3">
              <GitCommit className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={commit.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline leading-tight line-clamp-2">
                        {commit.message}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View commit on GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">{commit.author}</span> committed {commit.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
