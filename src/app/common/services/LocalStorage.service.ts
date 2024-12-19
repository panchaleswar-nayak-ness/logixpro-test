import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

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
        'MostPicks': false
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
        'MostPicks': false
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
             updatedUserPickChecked.MostPicks
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
        'MostPicks': false
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
        'MostPicks': false
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
             updatedUserPutChecked.MostPicks
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
        'MostPicks': false
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
        'MostPicks': false
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
             updatedUserPickChecked.MostPicks
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
        'MostPicks': false
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
        'MostPicks': false
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
             updatedUserPutChecked.MostPicks
         ];
     }
     return []; // If no pick checks found for the user, return an empty array

  }

  clearLocalStorage(): void {
  
    // Get the total number of keys in localStorage   
    const totalKeys: number = localStorage.length;

    // Create an array of keys to be excluded from removal
    const exceptKeys: string[] = ['CountPickChecks','CountPutChecks', 'CountPickChecksLocation', 'CountPutChecksLocation']; // Add more keys as needed

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