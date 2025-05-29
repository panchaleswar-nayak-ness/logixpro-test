import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/common/services/shared.service';
import labels from 'src/app/common/labels/labels.json';
import { LicensingInvalidComponent } from 'src/app/admin/dialogs/licensing-invalid/licensing-invalid.component';
import { Subject, takeUntil } from 'rxjs';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType, DialogConstants, Style, UniqueConstants, StringConditions, AppLicensingDisplayedColumns, ConfirmationMessages, ToasterMessages } from 'src/app/common/constants/strings.constants';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AppLicense, LicenseModule, SaveLicense } from 'src/app/common/Model/licensing';
import { ApiResponse } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-licensing',
  templateUrl: './licensing.component.html',
  styleUrls: ['./licensing.component.scss'],
})

export class LicensingComponent implements OnInit {
  sideBarOpen: boolean = true;
  onDestroy$: Subject<boolean> = new Subject();
  displayedColumns: string[] = [
    AppLicensingDisplayedColumns.AppName,
    AppLicensingDisplayedColumns.DisplayName,
    AppLicensingDisplayedColumns.License,
    AppLicensingDisplayedColumns.NumLicense,
    AppLicensingDisplayedColumns.Status,
    AppLicensingDisplayedColumns.AppURL,
    AppLicensingDisplayedColumns.Save,
  ];
  dataSource = new MatTableDataSource<AppLicense>();
  licAppData: { [key: string]: LicenseModule; };
  addingNew: boolean = false;
  @ViewChildren('printerNameInput', { read: ElementRef }) printerNameInputs: QueryList<ElementRef>;

  public iGlobalConfigApi: IGlobalConfigApi
  constructor(
    private readonly sharedService: SharedService,
    public readonly globalConfigApi: GlobalConfigApiService,
    private readonly global: GlobalService,
    private readonly renderer: Renderer2,
  ) {
    this.iGlobalConfigApi = globalConfigApi;
  }

  ngOnInit(): void {
    let appData = this.sharedService.getApp();
    if (!appData) {
      this.getAppLicense();
    } else {
      this.licAppData = appData;
      this.convertToObj();
    }
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  getAppLicense() {
    this.iGlobalConfigApi.AppLicense().subscribe(
      {
        next: (res: ApiResponse<{ [key: string]: LicenseModule; }>) => {
          if (res?.data) {
            this.licAppData = res.data;
            this.convertToObj();
            this.sharedService.setApp(this.licAppData);
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("AppLicense", res.responseMessage);
          }
        },
        error: (error) => {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.error('AppLicense', error);
        }
      }
    );
  }

  onInputValueChange(index: number) {
    this.dataSource.filteredData[index]['isButtonDisable'] = false;
  }

  convertToObj() {
    const arrayOfObjects: AppLicense[] = [];
    for (const key of Object.keys(this.licAppData)) {
      arrayOfObjects.push({
        appname: this.licAppData[key].info.name,
        displayname: this.licAppData[key].info.displayName,
        license: this.licAppData[key].info.licenseString,
        numlicense: this.licAppData[key].numLicenses,
        status: this.licAppData[key].isLicenseValid ? 'Valid' : 'Invalid',
        appurl: this.licAppData[key].info.url,
        isButtonDisable: true,
      });
    }
    this.dataSource = new MatTableDataSource(arrayOfObjects);
  }

  saveLicense(item: AppLicense) {
    const payload: SaveLicense = {
      LicenseString: item.license,
      AppUrl: item.appurl,
      DisplayName: item.displayname,
      AppName: item.appname
    };
    this.iGlobalConfigApi
      .ValidateLicenseSave(payload)
      .subscribe(
        {
          next: (res: ApiResponse<number | null>) => {
            if (res.isExecuted) {
              this.getAppLicense();
              this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
            }
            else {
              let dialogRef = this.global.OpenDialog(LicensingInvalidComponent, {
                width: '550px',
                autoFocus: DialogConstants.autoFocus,
                disableClose: true,
                data: {
                  displayName: item.displayname,
                  mode: '',
                },
              });
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((result) => {
                  this.getAppLicense();
                });
            }
            this.addingNew = false;
          },
          error: (error) => {
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.error('ValidateLicenseSave', error);
            this.addingNew = false;
          }
        }
      );
  }

  addLincenseRow() {
    this.addingNew = true;
    this.dataSource.filteredData.splice(0, 0, this.createObjectNewConn());
    this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
    const lastIndex = this.dataSource.filteredData.length - 1;
    setTimeout(() => {
      const inputElements = this.printerNameInputs.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[lastIndex].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  createObjectNewConn(): AppLicense {
    const newLicenseObj: AppLicense = {
      appname: '',
      displayname: '',
      license: '',
      numlicense: 0,
      status: 'Invalid',
      appurl: '',
      isButtonDisable: true,
      isNewRow: true
    };
    return newLicenseObj;
  }

  removeLicense(License: AppLicense) {
    const dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'remove-license',
        ErrorMessage: ConfirmationMessages.DeleteLicenseConfirmation,
        action: UniqueConstants.delete
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === StringConditions.Yes) {
        if (License.isNewRow) {
          this.dataSource.filteredData = this.dataSource.filteredData.filter((item: AppLicense) => !item.isNewRow);
          this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
          this.addingNew = false;
        }
        else {
          this.iGlobalConfigApi.DeleteAppLicense(License.appname).subscribe(
            {
              next: (res: ApiResponse<boolean>) => {
                if (res.isExecuted && res.data) {
                  this.dataSource.filteredData = this.dataSource.filteredData.filter((item: AppLicense) => item.appname != License.appname);
                  this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
                  this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
                } else {
                  this.global.ShowToastr(ToasterType.Error, ToasterMessages.DeleteFailed, ToasterTitle.Error);
                  console.log("RemoveLicense", res.responseMessage);
                }
              },
              error: (error) => {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.error('RemoveLicense', error);
              }
            }
          );
        }
      }
    });
  }

  isSaveDisabled(license: AppLicense): boolean {
    return license.isButtonDisable ||
           !license.appname?.trim() ||
           !license.displayname?.trim() ||
           !license.license?.trim() ||
           !license.appurl?.trim();
  }
}
