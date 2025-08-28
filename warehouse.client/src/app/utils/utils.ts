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

export function dateToDateOnly(source: Date): string {
  return source.toISOString().slice(0, 10);
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

export enum BeFilterMathcType {
  EQUALS = 0,
  IN = 1,
  MORETHAN = 2,
  LESSTHAN = 3,
  NOTEQUAL = 4,
}

export type BeFilterMetadata = {
  field: string;
  matchType: BeFilterMathcType;
  value?: string;
  dateValue?: Date;
  values?: Array<string>;
  numberValues?: Array<number>;
}

export function gridFilterToBeFilter(primengFilter: GridFilters): Array<BeFilterMetadata> {
  const result: Array<BeFilterMetadata> = [];
  for(let filteredField in primengFilter) {
    const fieldFilter = primengFilter[filteredField];
    if (Array.isArray(fieldFilter)) {
      for(let filterClause of fieldFilter) {
        if (filterClause.matchMode && filterClause.value !== null) {
          switch (filterClause.matchMode) {
            case 'dateIs':
              result.push({ field: filteredField, matchType: BeFilterMathcType.EQUALS, dateValue: filterClause.value });
              break;
            case 'dateAfter':
              result.push({ field: filteredField, matchType: BeFilterMathcType.MORETHAN, dateValue: filterClause.value });
              break;
            case 'dateBefore':
              result.push({ field: filteredField, matchType: BeFilterMathcType.LESSTHAN, dateValue: filterClause.value });
              break;
            case 'dateIsNot':
              result.push({ field: filteredField, matchType: BeFilterMathcType.NOTEQUAL, dateValue: filterClause.value });
              break;
            default:
              console.error(`not supported filter type ${filterClause.matchMode}`, filterClause);
          }
        }
      }
    } else if (fieldFilter && fieldFilter.matchMode && fieldFilter.value !== null) {
      console.log('item', fieldFilter);
      switch (fieldFilter.matchMode) {
        case 'in':
          if (Array.isArray(fieldFilter.value) && fieldFilter.value.length > 0) {
            if (typeof fieldFilter.value[0] === "number") {
              result.push({ field: filteredField, matchType: BeFilterMathcType.IN, numberValues: fieldFilter.value });
            } else {
              result.push({ field: filteredField, matchType: BeFilterMathcType.IN, values: fieldFilter.value });
            }
          }
          break;
        default:
          if (fieldFilter.matchMode) {
            console.error(`matchMode [${fieldFilter.matchMode}] not supported`, fieldFilter);
          }
      }
    }
  }
  return result;
}
