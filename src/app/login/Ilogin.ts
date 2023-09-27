export interface ILogin {
  userName?: string | null;
    password?: string | null;
    token?: string | null;
    isExecuted?: boolean | null;
    accessLevel?: string | null;
    responseMessage?: string | null;
    loginTime?: string | null;
    wsid?: string | null;

  }

export interface ILoginInfo {
    userName?: string;
    password?: string;
    token?: string | null;
    isExecuted?: boolean | null;
    accessLevel?: string | null;
    responseMessage?: string | null;
    loginTime?: string | null;
    data?: object | null;

  }

  