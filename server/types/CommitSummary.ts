export type CommitSummary = {
  user: string;
  time: Date;
  message: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  actualChanges?: string;
};
