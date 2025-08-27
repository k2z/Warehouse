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
  EQUALS,
  IN,
  MORETHAN,
  LESSTHAN,
  NOTEQUAL,
}

export type BeFilterMetadata = {
  field: string;
  matchType: BeFilterMathcType;
  value?: string;
  dateValue?: Date;
  values?: Array<string>;
  dateFrom?: Date;
  dateTo?: Date;
}

export function gridFilterToBeFilter(primengFilter: GridFilters): Array<BeFilterMetadata> {
  const result: Array<BeFilterMetadata> = [];
  for(let filteredField in primengFilter) {
    const fieldFilter = primengFilter[filteredField];
    if (Array.isArray(fieldFilter)) {
      for(let filterClause of fieldFilter) {
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
            if (filterClause.matchMode) {
              console.error(`not supported filter type ${filterClause.matchMode}`, filterClause);
            }
        }
      }
    } else if (fieldFilter && fieldFilter.matchMode && fieldFilter.value !== null) {
      console.log('item', fieldFilter);
      switch (fieldFilter.matchMode) {
        case 'in': 
          result.push({ field: filteredField, matchType: BeFilterMathcType.IN, values: fieldFilter.value });
          break;
        default:
          if (fieldFilter.matchMode) {
            console.log(`matchMode [${fieldFilter.matchMode}] not supported`, fieldFilter);
          }
      }
    }
  }
  return result;
}
