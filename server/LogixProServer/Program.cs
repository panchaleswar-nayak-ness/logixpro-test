using LogixProServer.Common;
using LogixProServer.Middleware;
using NLog.Extensions.Logging;
using PeakLogix.NetCoreLib.LogixConfiguration;
using PeakLogix.NetCoreLib.Util;
using System.Net;

public class Program
{
  private static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UpdateConfiguration();

    var config = builder.Configuration;
    var endpoints = GetEndpointConfig(config);
    NLog.LogManager.Configuration = new NLogLoggingConfiguration(config.GetSection("NLog"));

    builder.Logging.ClearProviders();
    builder.Logging.AddNLog();


    var logger = LoggerFactory.Create(loggingBuilder => loggingBuilder.AddNLog()).CreateLogger<Program>();
    ConfigureServices(builder.Services);

    builder.WebHost.ConfigureKestrel((context, options) =>
    {
      logger.LogInformation("Configuring Kestrel");
      options.ConfigureEndpoints(logger, endpoints);
      ConfigureDelayedAutoStart(logger, context);
    });

    builder.Host.UseWindowsService();

    var app = builder.Build();
    app.UseMiddleware<ErrorHandlingMiddleware>();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseEndpoints(endpoints => { endpoints.MapFallbackToFile("index.html"); });

    app.MapGet("/apiurl", (AppSettings appSettings) => appSettings.ApiUrl);
    app.MapGet("/versioninfo", (AppSettings appSettings) => appSettings.AppVersion);

    app.Run();
    return;


    // Configre the service for the appication
    void ConfigureServices(IServiceCollection services)
    {
      services.AddSingleton<AppSettings>();
      services.AddEndpointsApiExplorer();
      services.AddSwaggerGen();

      var enableRedirect = config.GetValue<bool>("HttpServer:EnableRedirect");
      var httpsPort = endpoints.FirstOrDefault(x => x.Value.Scheme == "https").Value.Port;

      if (enableRedirect && null != httpsPort)
      {
        services.AddHttpsRedirection(options =>
        {

          logger.LogInformation($"Configuring HTTPS redirection on port {httpsPort}");
          options.HttpsPort = httpsPort;
          options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
        });
      }
    }


    /// <summary>
    /// Get the endpoint configuration from the configuration file
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    static void ConfigureDelayedAutoStart(ILogger logger, WebHostBuilderContext context)
    {
      //#if DEBUG
      //  return;
      //#endif

      string certificateStoreServiceName = context.Configuration["AppSettings:CertificateStoreServiceName"]!;

      logger.LogInformation("Setting service to start= delayed-auto");
      WinScript.RunCommand("sc", $"config {certificateStoreServiceName} start= delayed-auto", outputData =>
      {
        logger.LogInformation(outputData);
      },
          errorData =>
          {
            logger.LogError(errorData);
          });
    }


    /// <summary>
    /// Get the endpoint configuration from the configuration file
    /// </summary>
    /// <param name="config"></param>
    /// <returns>A Dictionary of string, EndpointConfiguration</returns>
    static Dictionary<string, EndpointConfiguration> GetEndpointConfig(IConfiguration config)
    {

      var endpoints = config.GetSection("HttpServer:Endpoints")
          .GetChildren()
          .ToDictionary(section => section.Key, section =>
          {
            var endpoint = new EndpointConfiguration();
            section.Bind(endpoint);
            return endpoint;
          });

      return endpoints;
    }
  }
}
