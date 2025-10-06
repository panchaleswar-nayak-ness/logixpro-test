import { CompareLineState } from '../../enums/admin/CompareLineState';

export interface CompareItem {
    id: string;
    compareGroup: string;
    itemNumber: string;
    quantityDifference: number;
    warehouse: string;
    lotNumber: string;
    expirationDate: string;
    serialNumber: string;
    currentState: CompareLineState;
    currentStateString: string;
}
