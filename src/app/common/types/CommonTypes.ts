import { OperationTypes } from "../enums/CommonEnums";

export interface Operations {
    condition: string;
    title: string;
    type: OperationTypes;
}

export interface TableHeaderDefinitions {
    colHeader: string,
    colDef: string
} 

export type ValidWorkstation = {
    pcName: string, 
    wsid: string
};

export interface ApiResponse<T> {
    data: T;
    responseMessage: string;
    isExecuted: boolean;
}

export interface OpenTransactions {
    id: number,
    orderNumber: string,
    lotNumber: string,
    hostTransactionID: string,
    transactionQuantity: number,
    serialNumber: string,
    location: string,
    userField1: string,
    userField2: string,
    warehouse: string,
    zone: string,
    rn: number
}

export interface ColumnAlias {
    itemNumber: string;
    unitOfMeasure: string;
    userField1: string;
    userField2: string;
    userField3: string;
    userField4: string;
    userField5: string;
    userField6: string;
    userField7: string;
    userField8: string;
    userField9: string;
    userField10: string;
}
