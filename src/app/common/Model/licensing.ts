export interface AppLicense {
    appname: string;
    appurl: string;
    displayname: string;
    isButtonDisable: boolean;
    license: string;
    numlicense: number;
    status: string;
    isNewRow?: boolean;
}

export interface SaveLicense {
    LicenseString: string;
    AppUrl: string;
    DisplayName: string;
    AppName: string;
}

export interface LicenseInfo {
    name: string;
    licenseString: string;
    url: string;
    displayName: string;
}

export interface LicenseModule {
    isLicenseValid: boolean;
    numLicenses: number;
    info: LicenseInfo;
}