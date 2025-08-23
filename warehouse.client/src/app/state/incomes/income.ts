
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
  date: string;
  // dateValue?: Date;
  items: Array<IncomeResource>;
}
