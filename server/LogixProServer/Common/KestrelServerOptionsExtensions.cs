using System;
using System.Configuration;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using PeakLogix.NetCoreLib.Certificates;

namespace LogixProServer.Common
{

  public static class KestrelServerOptionsExtensions
  {
    public static void ConfigureEndpoints(this KestrelServerOptions options, ILogger logger, Dictionary<string, EndpointConfiguration> endpoints)
    {
      logger.LogInformation($"Configuring endpoints, number of endpoints: {endpoints.Count}");

      foreach (var endpoint in endpoints)
      {
        logger.LogInformation($"Configuring endpoint: {endpoint.Key}");

        var config = endpoint.Value;
        var port = config.Port ?? (config.Scheme == "https" ? 443 : 80);

        logger.LogInformation($"Configuring endpoint: {endpoint.Key}, Port: {port}, Host: {config.Host}, Scheme: {config.Scheme}");

        var ipAddresses = new List<IPAddress>();
        if (config.Host == "localhost")
        {
          logger.LogInformation("Configuring localhost");
          ipAddresses.Add(IPAddress.IPv6Loopback);
          ipAddresses.Add(IPAddress.Loopback);
        }
        else if (IPAddress.TryParse(config.Host, out var address))
        {
          logger.LogInformation($"Configuring IP address: {address}");
          ipAddresses.Add(address);
        }
        else
        {
          logger.LogInformation($"Configuring Any Address");
          ipAddresses.Add(IPAddress.IPv6Any);
          ipAddresses.Add(IPAddress.Any);
        }

        foreach (var address in ipAddresses)
        {
          logger.LogInformation($"Configuring listenter for address: {address}, port: {port}");

          options.Listen(address, port,
              listenOptions =>
              {
                if (config.Scheme == "https")
                {
                  var certificate = GetServerCertificate(logger, endpoint.Value);

                  if (certificate != null)
                  {
                    logger.LogInformation("Configuring HTTPS with certificate");
                    listenOptions.UseHttps(certificate);
                  }
                  else
                  {
                    logger.LogError("No server certificate configured, will not configure HTTPS.");
                  }
                }
              });
        }
      }
    }

    /// <summary>
    /// Get the server certificate from the service store, cert store, or file
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="config"></param>
    /// <returns></returns>
    private static X509Certificate2? GetServerCertificate(ILogger logger, EndpointConfiguration config)
    {
      X509Certificate2? cert = null;

      cert = GetCertFromServiceStore(logger, config);

      if (cert == null)
      {
        logger.LogInformation("Could not get certificate from service store, will try cert store");

        cert = GetCertificateFromStore(logger, config);

        if (cert == null)
        {
          logger.LogInformation("Could not get certificate from store, will try file");

          cert = GetCertificateFromFile(logger, config);
        }

      }

      return cert;
    }


    /// <summary>
    /// Try to get the certificate from the configured service store
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="config"></param>
    /// <returns></returns>
    private static X509Certificate2? GetCertFromServiceStore(ILogger logger, EndpointConfiguration config)
    {
      X509Certificate2? cert = null;

      if (string.IsNullOrWhiteSpace(config.CertificateThumbprint) ||
          string.IsNullOrWhiteSpace(config.ServiceName) ||
          config.ServiceName == ConfigConstants.InvalidCertThumbprint)
      {
        logger.LogInformation($"Service Name and Thumbprint are invalid" +
          $"Thumbprint: {config.CertificateThumbprint}, ServiceName: {config.ServiceName}");
      }
      else
      {
        try
        {
          cert = ServiceStore.GetCertificateFromServiceStore(config.ServiceName!,
                                                              ConfigConstants.MyCertStore,
                                                              config.CertificateThumbprint!);
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Error getting certificate from service store");
        }
      }

      return cert;

    }


    /// <summary>
    /// Get the configured certificate from the configured cert store
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="config"></param>
    /// <returns></returns>
    private static X509Certificate2? GetCertificateFromStore(ILogger logger, EndpointConfiguration config)
    {
      X509Certificate2? cert = null;

      if (string.IsNullOrWhiteSpace(config.StoreName) || string.IsNullOrWhiteSpace(config.StoreLocation))
      {
        logger.LogWarning("No store name or location configured for certificate");
      }
      else
      {
        using (var store = new X509Store(config.StoreName, Enum.Parse<StoreLocation>(config.StoreLocation)))
        {
          store.Open(OpenFlags.ReadOnly);

          var certificate = store.Certificates.Find(X509FindType.FindBySubjectName,
                                                    config.Host,
                                                    validOnly: false);

          cert = certificate.FirstOrDefault();
        }

        //TODO: use certificate store in NetCoreLib after release 
        //var cert = CertificateStore.GetCertificate(config.Host);
      }

      return cert;
    }


    /// <summary>
    /// Get the configured certificate from the configured file
    /// </summary>
    /// <param name="logger"></param>
    /// <param name="config"></param>
    /// <returns></returns>
    private static X509Certificate2? GetCertificateFromFile(ILogger logger, EndpointConfiguration config)
    {
      X509Certificate2? cert = null;

      if (string.IsNullOrWhiteSpace(config.FilePath) || string.IsNullOrWhiteSpace(config.Password))
      {
        logger.LogWarning("No file path or password configured for certificate");
      }
      else
      {
        if (!File.Exists(config.FilePath))
        {
          logger.LogWarning($"File does not exist: {config.FilePath}");
        }
        else
        {
          try
          {
            logger.LogInformation($"Loading certificate from file: {config.FilePath}");
            cert = new X509Certificate2(config.FilePath, config.Password);
          }
          catch (Exception ex)
          {
            logger.LogError(ex, "Error loading certificate from file");
          }
        }
      }

      return cert;
    }
  }
}
