export type CommitSummary = {
  user: string;
  repo: string;
  time: Date | string; // so we can store in JSON file
  message: string;
  linesAdded: number;
  linesRemoved: number;
  filesChangedNum: number;
  filesChangedNames?: string;
  actualChanges?: string;
  comment?: string;
};

export type CommitsByUser = {
  user: string;
  commits: CommitSummary[];
};
