import { AccessLevelByGroupFunctions, ApiResponse, EmployeeAccessLevel } from "../../types/CommonTypes";
import { ILocalStorageCache } from "../localstorage-cache/localstorage-cache-interface";
import { ApiFuntions } from "../ApiFuntions";
import { IUserAccessLevels } from "./user-access-levels-interface";
import { Injectable } from "@angular/core";
import { LocalStorageCache } from "../localstorage-cache/localstorage-cache";
import { LocalStorageCacheKeys } from "../../constants/strings.constants";


@Injectable({
  providedIn: 'root'
})


export class UserAccessLevels implements IUserAccessLevels {

    private readonly localStorageKey :string = LocalStorageCacheKeys.EmployeeAccessLevels;
    private readonly localStorageCache: ILocalStorageCache<EmployeeAccessLevel> = new LocalStorageCache<EmployeeAccessLevel>();

    constructor(private readonly Api: ApiFuntions) { 
                    this.localStorageCache.init(this.localStorageKey);
                }
    Init(userName: string): void {
        let storageKey = this.localStorageKey + "_" + userName;
        this.localStorageCache.init(storageKey);
    }


    AccessLevelByGroup(username: string): Promise<EmployeeAccessLevel> {

        let accessLevels : EmployeeAccessLevel =  this.localStorageCache.getData();

        if (accessLevels) {
            return Promise.resolve(accessLevels);
        }
      
        // Return a promise that resolves with the data from the API
        return new Promise((resolve) => {

             this.Api.AccessLevelByGroupFunctions().subscribe((res: ApiResponse<EmployeeAccessLevel>) => {
                  if (res.isExecuted && res.data) {
                    const data: EmployeeAccessLevel = {
                        lastRefreshedDateTime: new Date(),
                        accessStorageContainer: res.data.accessStorageContainer,
                        accessClearWholeLocation: res.data.accessClearWholeLocation,
                        accessAddInvMapLocation: res.data.accessAddInvMapLocation
                    };

                    this.localStorageCache.setData(data);
                    resolve(data);
                  }
                });
        });
    }

    RefreshAccessLevelByGroupCache(username: string): Promise<EmployeeAccessLevel> {
        return new Promise((resolve) => {

            this.Api.AccessLevelByGroupFunctions().subscribe((res: ApiResponse<EmployeeAccessLevel>) => {
                 if (res.isExecuted && res.data) {
                   const data: EmployeeAccessLevel = {
                       lastRefreshedDateTime: new Date(),
                       accessStorageContainer: res.data.accessStorageContainer,
                       accessClearWholeLocation: res.data.accessClearWholeLocation,
                       accessAddInvMapLocation:res.data.accessAddInvMapLocation,
                   };

                   this.localStorageCache.setData(data);
                   resolve(data);
                 }
               });
       });
    }
}