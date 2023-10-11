import { GlobalConfigApiService } from "./global-config-api.service";

export interface IGlobalConfigApi extends GlobalConfigApiService
{
    workstationdefaultapp(payload: any); 
    GlobalMenu(paylaod: any); 
    AppLicense();
    getWorkstationapp (paylaod: any);
    workstationapp (paylaod: any);
    WorkStationDelete(paylaod :any);
    WorkStationDefaultAppAdd(paylaod :any);
    WorkStationDefaultAppAddDefault(paylaod :any);
    WorkStationAppDelete(paylaod :any); 
    AppNameByWorkstation(paylaod :any);
    configLogout(paylaod :any);
    startSTEService();
    stopSTEService();
    RestartSTEService();
    ServiceStatusSTE();
    ServiceStatusCCSIF();
    stopCCSIF();
    startCCSIF();
    GetAllPrinters(paylaod :any);
    UpdWSPrefsPrinters(payload: any);
    StatusPrintService(payload: any);
    StartPrintService(paylaod: any);
    StopPrintService(paylaod: any);
    RestartPrintService(paylaod: any);
    deletePrinter(paylaod: any);
    InsertNewPrinter(paylaod: any);
    UpdateCurrentPrinter(paylaod: any);
    ValidateLicenseSave(paylaod: any);
    LoginUser(paylaod: any);
    Menu(paylaod: any);
    ConnectionUserPassword(paylaod: any);
    ConnectionSave(paylaod: any);
    LAConnectionStringSet(paylaod: any);
    ChangeGlobalAccount(paylaod: any);
    ConnectedUser();
    ConnectionUserPasswordUpdate(paylaod: any);
    ConnectionDelete(paylaod: any);
    GetWorkStatPrinters();
} 