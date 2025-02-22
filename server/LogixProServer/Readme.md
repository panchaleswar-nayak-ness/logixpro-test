# Logix Pro Kestrel Server Configuration

This project is used to create a Kestrel server to host the LogixPro Frontend application. The front end application is an Angular application.

## AppSettings HttpServer

| Property    | Purpose  | Valid Values | 
| :---------------- | :------: |  ----: |
| EnableHttpsRedirection| Enables https redirect  | boolean |

## Appsettings HttpServer.Endpoints Configuration Definitions
`Endpoints` are an array of endpoint objects below is the definition of an endpoint

| Property    | Purpose  | Valid Values | 
| :---------------- | :------ |  :---- |
| host    | TBD |  url string, ex. `logixpro.peaklogix.com` |
| port    | Port used for the endpoint | integer beteen `1 and 6550 `|
| scheme  | sets the type of endpoint | string `http` or `https` |
| StoreName | Name of the certificate store to search | string  |
| FilePath | Full file path of  the cert file | string, Full file path and file name  |
| Password | Password of the provided cert file  | string  |
| ServiceName | The name of the service assciated with a cert | string |
| CertificateThumbprint | The thumbprint of the certifice to search for | string |


### Usage 

Note: Evaluated in this order

1) For all permutations you must provide the `host`, `port`, and `scheme`
2) To load a services certificate provide the `ServiceName` and `CertificateThumbprint`
3) To load a cert from a specific store provide the full `StoreName`
4) To load a cert from a file you must provide both `FilePath` and `Password `


## AppSettings Logging

We are using the NLog.Extensions.Logging library and you may reference the json definition from this location.
https://github.com/NLog/NLog.Extensions.Logging/wiki/NLog-configuration-with-appsettings.json