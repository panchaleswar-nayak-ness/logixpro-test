export enum ResultStatus {
    Success = 'Success',
    Error = 'Error',
    ValidationError = 'ValidationError'
}

export interface RequestResult {
    status: ResultStatus;
    message: string;
    errors: string[];
    isSuccess: boolean;
}
