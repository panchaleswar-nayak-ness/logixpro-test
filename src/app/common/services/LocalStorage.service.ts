import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { UserSession } from '../types/CommonTypes';
import { ProcessPicksPickTypePreference, WorkstationZoneFilterPreference } from '../interface/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  userData: UserSession;
  constructor(private authService: AuthService) {
    this.userData = authService.userData();
  }

  SetImportCountLocationChecks(e: any, type: any): any[] {

    let LoggedInUserData: any = localStorage.getItem('user'); // Logged-in user data
    let LoggedInUserName: any = (JSON.parse(LoggedInUserData)).userName;  // Get current login user name from Logged-in user data
    let AllPickChecks: any = localStorage.getItem('ImportCountLocationChecks'); // Pick Checks Data for all users
    
    if (AllPickChecks) // check if any value exists in local storage
    {
    
    let usersPickChecks: any[] = JSON.parse(AllPickChecks);
    let userPickChecked = usersPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
    
    if (userPickChecked) // check if value exists for loggedIn user in local storage
      {
      
      if (type === 'empty'){
        userPickChecked.emptyLocation = e.checked;
      }  
      else if (type === 'other'){
        userPickChecked.otherLocation = e.checked;
      }
      
      localStorage.setItem('ImportCountLocationChecks', JSON.stringify(usersPickChecks));

    }
    else //if value not exists for loggedIn user then add
    {

      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'emptyLocation': false,
        'otherLocation': false
      }


     usersPickChecks.push(PickChecks);
     localStorage.setItem('ImportCountLocationChecks', JSON.stringify(usersPickChecks));
    }
    
    } // if value not exists for any user in local storage then add value in it
    
    else
    {
     
      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'emptyLocation': false,
        'otherLocation': false
      }

      let allPickChecks = [PickChecks];
      localStorage.setItem('ImportCountLocationChecks', JSON.stringify(allPickChecks)); 
        
    } 
   
     // Retrieve the updated userPickChecked from localStorage after changes
     let updatedPickChecks: any[] = JSON.parse(localStorage.getItem('ImportCountLocationChecks') || '[]');
     let updatedUserPickChecked = updatedPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
     
     // Return the array of values
     if (updatedUserPickChecked) {
         return [
             updatedUserPickChecked.emptyLocation,
             updatedUserPickChecked.otherLocation
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }

  SetCountPickChecks(e: any, type: any): any[] {

    let LoggedInUserData: any = localStorage.getItem('user'); // Logged-in user data
    let LoggedInUserName: any = (JSON.parse(LoggedInUserData)).userName;  // Get current login user name from Logged-in user data
    let AllPickChecks: any = localStorage.getItem('CountPickChecks'); // Pick Checks Data for all users
    
    if (AllPickChecks) // check if any value exists in local storage
    {
    
    let usersPickChecks: any[] = JSON.parse(AllPickChecks);
    let userPickChecked = usersPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
    
    if (userPickChecked) // check if value exists for loggedIn user in local storage
      {
      
      if (type === 'Pick') {
        userPickChecked.HotPick = e.checked;
      }  
      else if (type === 'Move'){
        userPickChecked.HotMove = e.checked;
      }
      else if (type === 'Replenishment'){
        userPickChecked.Replenishment = e.checked;
      }
      else if (type === 'SortPicks'){
        userPickChecked.MostPicks = e.checked;
      }
      else if (type === 'picklocincludeEmpty'){
        userPickChecked.picklocincludeEmpty = e.checked;
      }
      else if (type === 'picklocincludeOther'){
        userPickChecked.picklocincludeOther = e.checked;
      }
      
      localStorage.setItem('CountPickChecks', JSON.stringify(usersPickChecks));

    }
    else //if value not exists for loggedIn user then add
    {

      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'picklocincludeEmpty': true,
        'picklocincludeOther': true
      }


     usersPickChecks.push(PickChecks);
     localStorage.setItem('CountPickChecks', JSON.stringify(usersPickChecks));
    }
    
    } // if value not exists for any user in local storage then add value in it
    
    else
    {
     
      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'picklocincludeEmpty': true,
        'picklocincludeOther': true
      }

      let allPickChecks = [PickChecks];
      localStorage.setItem('CountPickChecks', JSON.stringify(allPickChecks)); 
        
    } 
   
     // Retrieve the updated userPickChecked from localStorage after changes
     let updatedPickChecks: any[] = JSON.parse(localStorage.getItem('CountPickChecks') || '[]');
     let updatedUserPickChecked = updatedPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
     
     // Return the array of values
     if (updatedUserPickChecked) {
         return [
             updatedUserPickChecked.HotPick,
             updatedUserPickChecked.HotMove,
             updatedUserPickChecked.Replenishment,
             updatedUserPickChecked.MostPicks,
             updatedUserPickChecked.picklocincludeEmpty,
             updatedUserPickChecked.picklocincludeOther
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }

  SetCountPutChecks(e: any, type: any): any[] {

    let LoggedInUserData: any = localStorage.getItem('user'); // Logged-in user data
    let LoggedInUserName: any = (JSON.parse(LoggedInUserData)).userName;  // Get current login user name from Logged-in user data
    let AllPutChecks: any = localStorage.getItem('CountPutChecks'); // Pick Checks Data for all users
    
    if (AllPutChecks) // check if any value exists in local storage
    {
    
    let usersPutChecks: any[] = JSON.parse(AllPutChecks);
    let userPutChecked = usersPutChecks.find((putCheck: any) => putCheck.UserName === LoggedInUserName);
    
    if (userPutChecked) // check if value exists for loggedIn user in local storage
      {
      
      if (type === 'Pick') {
        userPutChecked.HotPick = e.checked;
      }  
      else if (type === 'Move'){
        userPutChecked.HotMove = e.checked;
      }
      else if (type === 'Replenishment'){
        userPutChecked.Replenishment = e.checked;
      }
      else if (type === 'SortPicks'){
        userPutChecked.MostPicks = e.checked;
      }
      else if (type === 'putlocincludeEmpty'){
        userPutChecked.putlocincludeEmpty = e.checked;
      }
      else if (type === 'putlocincludeOther'){
        userPutChecked.putlocincludeOther = e.checked;
      }
      
      localStorage.setItem('CountPutChecks', JSON.stringify(usersPutChecks));

    }
    else //if value not exists for loggedIn user then add
    {

      let PutChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'putlocincludeEmpty': true,
        'putlocincludeOther': true
      }


     usersPutChecks.push(PutChecks);
     localStorage.setItem('CountPutChecks', JSON.stringify(usersPutChecks));
    }
    
    } // if value not exists for any user in local storage then add value in it
    
    else
    {
     
      let PutChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'putlocincludeEmpty': true,
        'putlocincludeOther': true
      }

      let allPutChecks = [PutChecks];
      localStorage.setItem('CountPutChecks', JSON.stringify(allPutChecks)); 
        
    } 
   
     // Retrieve the updated userPickChecked from localStorage after changes
     let updatedPutChecks: any[] = JSON.parse(localStorage.getItem('CountPutChecks') || '[]');
     let updatedUserPutChecked = updatedPutChecks.find((putCheck: any) => putCheck.UserName === LoggedInUserName);
     
     // Return the array of values
     if (updatedUserPutChecked) {
         return [
             updatedUserPutChecked.HotPick,
             updatedUserPutChecked.HotMove,
             updatedUserPutChecked.Replenishment,
             updatedUserPutChecked.MostPicks,
             updatedUserPutChecked.putlocincludeEmpty,
             updatedUserPutChecked.putlocincludeOther
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }

  
  SetCountPickChecksLocation(e: any, type: any): any[] {

    
    let LoggedInUserData: any = localStorage.getItem('user'); // Logged-in user data
    let LoggedInUserName: any = (JSON.parse(LoggedInUserData)).userName;  // Get current login user name from Logged-in user data
    let AllPickChecks: any = localStorage.getItem('CountPickChecksLocation'); // Pick Checks Data for all users
    
    if (AllPickChecks) // check if any value exists in local storage
    {
    
    let usersPickChecks: any[] = JSON.parse(AllPickChecks);
    let userPickChecked = usersPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
    
    if (userPickChecked) // check if value exists for loggedIn user in local storage
      {
      
      if (type === 'Pick') {
        userPickChecked.HotPick = e.checked;
      }  
      else if (type === 'Move'){
        userPickChecked.HotMove = e.checked;
      }
      else if (type === 'Replenishment'){
        userPickChecked.Replenishment = e.checked;
      }
      else if (type === 'SortPicks'){
        userPickChecked.MostPicks = e.checked;
      }
      else if (type === 'picklocincludeEmpty'){
        userPickChecked.picklocincludeEmpty = e.checked;
      }
      else if (type === 'picklocincludeOther'){
        userPickChecked.picklocincludeOther = e.checked;
      }
      
      localStorage.setItem('CountPickChecksLocation', JSON.stringify(usersPickChecks));

    }
    else //if value not exists for loggedIn user then add
    {

      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'picklocincludeEmpty': true,
        'picklocincludeOther': true
      }


     usersPickChecks.push(PickChecks);
     localStorage.setItem('CountPickChecksLocation', JSON.stringify(usersPickChecks));
    }
    
    } // if value not exists for any user in local storage then add value in it
    
    else
    {
     
      let PickChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'picklocincludeEmpty': true,
        'picklocincludeOther': true
      }

      let allPickChecks = [PickChecks];
      localStorage.setItem('CountPickChecksLocation', JSON.stringify(allPickChecks)); 
        
    } 
   
     // Retrieve the updated userPickChecked from localStorage after changes
     let updatedPickChecks: any[] = JSON.parse(localStorage.getItem('CountPickChecksLocation') || '[]');
     let updatedUserPickChecked = updatedPickChecks.find((pickCheck: any) => pickCheck.UserName === LoggedInUserName);
     
     // Return the array of values
     if (updatedUserPickChecked) {
         return [
             updatedUserPickChecked.HotPick,
             updatedUserPickChecked.HotMove,
             updatedUserPickChecked.Replenishment,
             updatedUserPickChecked.MostPicks,
             updatedUserPickChecked.picklocincludeEmpty,
             updatedUserPickChecked.picklocincludeOther
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }
  SetCountPutChecksLocation(e: any, type: any): any[] {

    let LoggedInUserData: any = localStorage.getItem('user'); // Logged-in user data
    let LoggedInUserName: any = (JSON.parse(LoggedInUserData)).userName;  // Get current login user name from Logged-in user data
    let AllPutChecks: any = localStorage.getItem('CountPutChecksLocation'); // Pick Checks Data for all users
    
    if (AllPutChecks) // check if any value exists in local storage
    {
    
    let usersPutChecks: any[] = JSON.parse(AllPutChecks);
    let userPutChecked = usersPutChecks.find((putCheck: any) => putCheck.UserName === LoggedInUserName);
    
    if (userPutChecked) // check if value exists for loggedIn user in local storage
      {
      
      if (type === 'Pick') {
        userPutChecked.HotPick = e.checked;
      }  
      else if (type === 'Move'){
        userPutChecked.HotMove = e.checked;
      }
      else if (type === 'Replenishment'){
        userPutChecked.Replenishment = e.checked;
      }
      else if (type === 'SortPicks'){
        userPutChecked.MostPicks = e.checked;
      }
      else if (type === 'putlocincludeEmpty'){
        userPutChecked.putlocincludeEmpty = e.checked;
      }
      else if (type === 'putlocincludeOther'){
        userPutChecked.putlocincludeOther = e.checked;
      }
      
      localStorage.setItem('CountPutChecksLocation', JSON.stringify(usersPutChecks));

    }
    else //if value not exists for loggedIn user then add
    {

      let PutChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'putlocincludeEmpty': true,
        'putlocincludeOther': true
      }


     usersPutChecks.push(PutChecks);
     localStorage.setItem('CountPutChecksLocation', JSON.stringify(usersPutChecks));
    }
    
    } // if value not exists for any user in local storage then add value in it
    
    else
    {
     
      let PutChecks = 
      {
        'UserName': LoggedInUserName,
        'HotPick': true,
        'HotMove': true,
        'Replenishment': true,
        'MostPicks': false,
        'putlocincludeEmpty': true,
        'putlocincludeOther': true
      }

      let allPutChecks = [PutChecks];
      localStorage.setItem('CountPutChecksLocation', JSON.stringify(allPutChecks)); 
        
    } 
   
     // Retrieve the updated userPickChecked from localStorage after changes
     let updatedPutChecks: any[] = JSON.parse(localStorage.getItem('CountPutChecksLocation') || '[]');
     let updatedUserPutChecked = updatedPutChecks.find((putCheck: any) => putCheck.UserName === LoggedInUserName);
     
     // Return the array of values
     if (updatedUserPutChecked) {
         return [
             updatedUserPutChecked.HotPick,
             updatedUserPutChecked.HotMove,
             updatedUserPutChecked.Replenishment,
             updatedUserPutChecked.MostPicks,
             updatedUserPutChecked.putlocincludeEmpty,
             updatedUserPutChecked.putlocincludeOther
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }
  private processPicksPickTypeKey = "ProcessPicksPickType"; // Key for process picks pick type in localStorage
  private processPicksPickTypeDefaultValue = "MixedZones"; // Default value for process picks pick type
  SetProcessPicksPickType(pickType: string): string {
    const LoggedInUserName: string = this.userData.userName;  // Get current login user name from Logged-in user data
    const AllPickTypePreferences: string | null = localStorage.getItem(this.processPicksPickTypeKey); // Pick Type preferences for all users
    
    if (AllPickTypePreferences) // check if any value exists in local storage
    {
      const usersPickTypePreferences: ProcessPicksPickTypePreference[] = JSON.parse(AllPickTypePreferences);
      const userPickTypePreference: ProcessPicksPickTypePreference | undefined = usersPickTypePreferences.find((pref: ProcessPicksPickTypePreference) => pref.UserName === LoggedInUserName);
      
      if (userPickTypePreference) // check if value exists for loggedIn user in local storage
      {
        userPickTypePreference.PickType = pickType;
        localStorage.setItem(this.processPicksPickTypeKey, JSON.stringify(usersPickTypePreferences));
      }
      else //if value not exists for loggedIn user then add
      {
        const PickTypePreference: ProcessPicksPickTypePreference = 
        {
          UserName: LoggedInUserName,
          PickType: pickType
        }
        usersPickTypePreferences.push(PickTypePreference);
        localStorage.setItem(this.processPicksPickTypeKey, JSON.stringify(usersPickTypePreferences));
      }
    } 
    else // if value not exists for any user in local storage then add value in it
    {
      const PickTypePreference: ProcessPicksPickTypePreference = 
      {
        UserName: LoggedInUserName,
        PickType: pickType
      }
      const allPickTypePreferences: ProcessPicksPickTypePreference[] = [PickTypePreference];
      localStorage.setItem(this.processPicksPickTypeKey, JSON.stringify(allPickTypePreferences)); 
    } 
   
    // Retrieve the updated pick type preference from localStorage
    const updatedPickTypePreferences: ProcessPicksPickTypePreference[] = JSON.parse(localStorage.getItem(this.processPicksPickTypeKey) || '[]');
    const updatedUserPickTypePreference: ProcessPicksPickTypePreference | undefined = updatedPickTypePreferences.find((pref: ProcessPicksPickTypePreference) => pref.UserName === LoggedInUserName);
    
    // Return the pick type value
    if (updatedUserPickTypePreference) {
      return updatedUserPickTypePreference.PickType;
    }
    return this.processPicksPickTypeDefaultValue; // Default value if not found
  }

  GetProcessPicksPickType(): string {
    const LoggedInUserName: string = this.userData.userName;  // Get current login user name from Logged-in user data
    const AllPickTypePreferences: string | null = localStorage.getItem(this.processPicksPickTypeKey); // Pick Type preferences for all users
    
    if (AllPickTypePreferences) {
      const usersPickTypePreferences: ProcessPicksPickTypePreference[] = JSON.parse(AllPickTypePreferences);
      const userPickTypePreference: ProcessPicksPickTypePreference | undefined = usersPickTypePreferences.find((pref: ProcessPicksPickTypePreference) => pref.UserName === LoggedInUserName);
      
      if (userPickTypePreference) {
        return userPickTypePreference.PickType;
      }
    }
    
    return this.processPicksPickTypeDefaultValue; // Default value if not found
  }

  private workstationZoneFilterKey = "WorkstationZoneFilter"; // Key for workstation zone filter in localStorage
  private workstationZoneFilterDefaultValue = { Carousel: true, CartonFlow: true, Bulk: false }; // Default values for workstation zone filter

  SetWorkstationZoneFilter(carousel: boolean, cartonFlow: boolean, bulk: boolean): WorkstationZoneFilterPreference {
    const LoggedInUserName: string = this.userData.userName;  // Get current login user name from Logged-in user data
    const AllZoneFilterPreferences: string | null = localStorage.getItem(this.workstationZoneFilterKey); // Zone Filter preferences for all users
    
    if (AllZoneFilterPreferences) // check if any value exists in local storage
    {
      const usersZoneFilterPreferences: WorkstationZoneFilterPreference[] = JSON.parse(AllZoneFilterPreferences);
      const userZoneFilterPreference: WorkstationZoneFilterPreference | undefined = usersZoneFilterPreferences.find((pref: WorkstationZoneFilterPreference) => pref.UserName === LoggedInUserName);
      
      if (userZoneFilterPreference) // check if value exists for loggedIn user in local storage
      {
        userZoneFilterPreference.Carousel = carousel;
        userZoneFilterPreference.CartonFlow = cartonFlow;
        userZoneFilterPreference.Bulk = bulk;
        localStorage.setItem(this.workstationZoneFilterKey, JSON.stringify(usersZoneFilterPreferences));
      }
      else //if value not exists for loggedIn user then add
      {
        const ZoneFilterPreference: WorkstationZoneFilterPreference = 
        {
          UserName: LoggedInUserName,
          Carousel: carousel,
          CartonFlow: cartonFlow,
          Bulk: bulk
        }
        usersZoneFilterPreferences.push(ZoneFilterPreference);
        localStorage.setItem(this.workstationZoneFilterKey, JSON.stringify(usersZoneFilterPreferences));
      }
    } 
    else // if value not exists for any user in local storage then add value in it
    {
      const ZoneFilterPreference: WorkstationZoneFilterPreference = 
      {
        UserName: LoggedInUserName,
        Carousel: carousel,
        CartonFlow: cartonFlow,
        Bulk: bulk
      }
      const allZoneFilterPreferences: WorkstationZoneFilterPreference[] = [ZoneFilterPreference];
      localStorage.setItem(this.workstationZoneFilterKey, JSON.stringify(allZoneFilterPreferences)); 
    } 
   
    // Retrieve the updated zone filter preference from localStorage
    const updatedZoneFilterPreferences: WorkstationZoneFilterPreference[] = JSON.parse(localStorage.getItem(this.workstationZoneFilterKey) || '[]');
    const updatedUserZoneFilterPreference: WorkstationZoneFilterPreference | undefined = updatedZoneFilterPreferences.find((pref: WorkstationZoneFilterPreference) => pref.UserName === LoggedInUserName);
    
    // Return the zone filter preference
    if (updatedUserZoneFilterPreference) {
      return updatedUserZoneFilterPreference;
    }
    return { UserName: LoggedInUserName, ...this.workstationZoneFilterDefaultValue }; // Default values if not found
  }

  GetWorkstationZoneFilter(): WorkstationZoneFilterPreference {
    const LoggedInUserName: string = this.userData.userName;  // Get current login user name from Logged-in user data
    const AllZoneFilterPreferences: string | null = localStorage.getItem(this.workstationZoneFilterKey); // Zone Filter preferences for all users
    
    if (AllZoneFilterPreferences) {
      const usersZoneFilterPreferences: WorkstationZoneFilterPreference[] = JSON.parse(AllZoneFilterPreferences);
      const userZoneFilterPreference: WorkstationZoneFilterPreference | undefined = usersZoneFilterPreferences.find((pref: WorkstationZoneFilterPreference) => pref.UserName === LoggedInUserName);
      
      if (userZoneFilterPreference) {
        return userZoneFilterPreference;
      }
    }
    
    return { UserName: LoggedInUserName, ...this.workstationZoneFilterDefaultValue }; // Default values if not found
  }

  clearLocalStorage(): void {
  
    // Get the total number of keys in localStorage   
    const totalKeys: number = localStorage.length;

    // Create an array of keys to be excluded from removal
    const exceptKeys: string[] = ['CountPickChecks','CountPutChecks', 'CountPickChecksLocation', 'CountPutChecksLocation','ImportCountLocationChecks','OrderStatusSelectionDefaultValue','ProcessPicksPickType','WorkstationZoneFilter']; // Add more keys as needed

    // Iterate through all the keys in localStorage
    for (let i = 0; i < totalKeys; i++) {
        // Get the key name
        const key: string | null = localStorage.key(i);
        
        // Ensure key is not null and check if the key is in the exceptKeys array
        if (key !== null && !exceptKeys.includes(key)) {
            // Remove the item if it's not in the exceptKeys array
            localStorage.removeItem(key);
        }
    }
}
}