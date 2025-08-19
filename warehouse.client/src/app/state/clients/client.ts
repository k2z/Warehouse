export enum ClientStatus {
  Active = 0,
  Archived = 1,
  Deleted = 2,
}

export type Client = {
  id: number;
  name: string;
  address: string;
  status: ClientStatus;
}
