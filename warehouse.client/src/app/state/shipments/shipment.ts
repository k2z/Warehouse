
export enum ShipmentState {
  Created = 0,
  Signed = 1,
  Rejected = 2,
}

export type ShipmentResource = {
  id: number;
  count: number;
  resource: string;
  resourceId: number;
  measure: string;
  measureId: number;
}

export type Shipment = {
  id: number;
  number: string;
  date: string;
  state: ShipmentState;
  client: string;
  clientId: number;
  items: Array<ShipmentResource>;
}
