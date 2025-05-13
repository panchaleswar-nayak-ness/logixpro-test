import { EmployeeAccessLevel } from "../../types/CommonTypes";

export interface IUserAccessLevels {
    Init(userName:string): void;
    AccessLevelByGroup(username: string): Promise<EmployeeAccessLevel>;
    RefreshAccessLevelByGroupCache(username: string): Promise<EmployeeAccessLevel>;
}
