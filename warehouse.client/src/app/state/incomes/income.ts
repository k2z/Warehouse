
export type IncomeResource = {
  id: number;
  count: number;
  resource: string;
  resourceId: number;
  measure: string;
  measureId: number;
}

export type Income = {
  id: number;
  number: string;
  date: Date;
  items: Array<IncomeResource>;
}
