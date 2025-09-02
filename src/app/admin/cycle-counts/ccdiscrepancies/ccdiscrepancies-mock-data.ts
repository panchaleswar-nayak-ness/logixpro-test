import { SelectedDiscrepancy } from '../../../common/interface/admin/ISelectedDiscrepancies';

export const MOCK_DISCREPANCIES: SelectedDiscrepancy[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  itemNumber: `ITM-100${i + 1}`,
  qtyDifference: Math.floor(Math.random() * 10 - 5),
  warehouse: `WH-B${i + 1}`,
  lotNo: `LOT-20250${i + 1}`,
  expirationDate: `2026-1${i % 2 + 1}-30`,
  serialNo: `SN-XYZ-00${i + 1}`
}));
