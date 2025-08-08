import { TotalQuantityFilter } from "../../../induction-manager/pick-tote-induction/filter-total-quantity/filter-total-quantity.component";

export interface TotalQuantityDialogResult {
    totalQuantityFilter: TotalQuantityFilter | null;
    isFilterByTotalQuantity?: boolean;
  }