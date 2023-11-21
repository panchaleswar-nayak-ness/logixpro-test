export interface IEmployee {
  users?:  string | null;
  userName?: string | null;
  lastName?:string | null;
  wsid?:string | null;
  firstName?: string | null;
  mi?:string | null;
  accessLevel?: string | null;
  deleteBy?:string | null;
  active?:boolean | null;
  maximumOrders?: number | null;
  groupName?:string | null;
  emailAddress?:string | null;
  filter?: any | null;
  controlName?:string | null;
  newValue?:boolean | null;
  startDate?:string | null;
  endDate?:string | null;
  startRow?:number| null;
  draw?:number| null;
  access?:string| null;
  zone?:string| null;
  startLocation?:string| null;
  endLocation?:string| null;
  oldStartLocation?:string| null;
  oldEndLocation?:string| null;
  levelID?:string| null;
  startShelf?:string| null;
  endShelf?:string| null;
  group?:string| null;
  GroupName?:string| null;

  }

  export interface Datum {
    controlName: string;
    function: string;
    adminLevel: boolean;
    }

    
export interface DataAccessGroup {
        userName?: string;
        group?: string;
        groupName?:string;
        wsid?:string

        }

  export interface PickLevel {
    pickLevel: number;
    startCarousel: number;
    endCarousel: number;
    startShelf: number;
}

 export interface AllAccess {
    controlName: string;
    function: string;
    adminLevel: boolean;
}

export interface AllGroup {
    groupName: string;
}

export interface ResponseData {
    allAccess?: AllAccess[];
    allGroups?: AllGroup[];
    PickLevel?:PickLevel[];
    bulkRange?: any[];
    handledZones?: string[];
    allZones?: string[];
    data?: Datum[]
 

}

export interface EmployeeObject {
    responseData: ResponseData|null;
    responseMessage: string;
    isExecuted: boolean;
}

export interface AccessGroupObject {
    data:DataAccessGroup;
    responseMessage: string;
    isExecuted: boolean;
}

export interface EmployeeResponse {
  
    firstName: string | null | undefined;
    username: string | null | undefined;
    mi:string | null | undefined;
    active: boolean;
    maximumOrders: number;
    password: string;
    accessLevel: string | null | undefined;
    groupName: string | null | undefined;
    emailAddress: string | null | undefined;
    wsid?: any;
  
    }

export interface AdminEmployeeLookup {
    employees?: EmployeeResponse[];
    data?:any;
}

export interface AdminEmployeeLookupResponse {
  
    responseData: AdminEmployeeLookup|null;
    responseMessage: string;
    isExecuted: boolean;
}
