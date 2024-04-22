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

export type ValidWorkstation = {pcName: string, wsid: string};

export interface ApiResponse<T> {
    data: T;
    responseMessage: string;
    isExecuted: boolean;
}
