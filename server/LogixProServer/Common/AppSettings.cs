
namespace LogixProServer.Common
{
    public class AppSettings(IConfiguration configuration) {
        public string ApiUrl => configuration["AppSettings:ApiUrl"] ?? throw new NullReferenceException("ApiUrl not found in appsettings.json");
        public string AppVersion => configuration["AppSettings:AppVersion"] ?? throw new NullReferenceException("AppVersion not found in appsettings.json");
    }
}