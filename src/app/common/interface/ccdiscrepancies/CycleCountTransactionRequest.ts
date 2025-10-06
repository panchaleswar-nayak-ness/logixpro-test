export interface CycleCountTransactionRequest {
    userName: string;
    itemNumber: string;
    serialNumber: string;
    lotNumber: string;
    expirationDate?: Date;
    hostQuantity: number;
}
