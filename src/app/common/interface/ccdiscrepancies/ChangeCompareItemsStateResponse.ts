import { StateChange } from './StateChange';

export interface ChangeCompareItemsStateResponse {
    success: boolean;
    message: string;
    stateChanges: StateChange[];
}
