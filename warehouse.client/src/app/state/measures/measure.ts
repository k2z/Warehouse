export enum MeasureStatus {
  Active = 0,
  Archived = 1,
  Deleted = 2,
}

export type Measure = {
  id: number;
  name: string;
  status: MeasureStatus;
}
