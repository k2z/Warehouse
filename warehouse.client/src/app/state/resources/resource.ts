export enum ResourceStatus {
  Active = 0,
  Archived = 1,
  Deleted = 2,
}

export type Resource = {
  id: string;
  name: string;
  status: ResourceStatus;
}
