import { FilterMetadata } from "primeng/api";

const characters = 'abcdefghijklmnopqrstuvwxyz';
const charactersLength = characters.length;
export function buildId(length: number = 5): string {
  let result = '';
  for (let i = 0; i<length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export type GridFilters = {
  [s: string]: FilterMetadata | FilterMetadata[] | undefined;
};

export type GridPageParams = {
  skip?: number;
  take?: number;
  filters?: GridFilters;
};

export type Page<TItem> = {
  count: number;
  items: Array<TItem>;
};
