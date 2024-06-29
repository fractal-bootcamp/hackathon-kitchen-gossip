export type CommitSummary = {
  user: string;
  time: Date;
  message: string;
  linesAdded: number;
  linesRemoved: number;
  filesChangedNum: number;
  filesChangedNames?: string;
  actualChanges?: string;
};
