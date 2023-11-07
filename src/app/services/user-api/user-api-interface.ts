export interface IUserAPIService 
{
    Logout();
    getSecurityEnvironment();
    login(payload: any);
    changePassword(payload: any);
    CompanyInfo();
}