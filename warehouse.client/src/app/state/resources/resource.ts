export enum ResourceStatus {
  Active = 0,
  Archived = 1,
  Deleted = 2,
}

export type Resource = {
  id: number;
  name: string;
  status: ResourceStatus;
}
