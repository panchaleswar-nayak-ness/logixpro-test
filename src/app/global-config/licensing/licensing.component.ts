import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service'; 
import labels from '../../labels/labels.json';
import { MatDialog } from '@angular/material/dialog';
import { LicensingInvalidComponent } from 'src/app/admin/dialogs/licensing-invalid/licensing-invalid.component';
import { Subject, takeUntil } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

export interface PeriodicElement {
  position: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'asdasd' },
  { position: 'asdasd' },
  { position: 'asdasd' },
  { position: 'asdasd' },
  { position: 'asdasd' },
  { position: 'asdasd' },
  { position: 'asdasd' },
];
@Component({
  selector: 'app-licensing',
  templateUrl: './licensing.component.html',
  styleUrls: ['./licensing.component.scss'],
})
export class LicensingComponent implements OnInit {
  sideBarOpen: boolean = true;
  onDestroy$: Subject<boolean> = new Subject();
  displayedColumns: string[] = [
    'appname',
    'displayname',
    'license',
    'numlicense',
    'status',
    'appurl',
    'save',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  licAppData;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  radioLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  constructor(
    private Api: ApiFuntions,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let appData = this.sharedService.getApp();
    if (!appData) {
      this.getAppLicense();
    } else {
      this.licAppData = appData;
      this.convertToObj();
    }
  }
  async getAppLicense() {
    // get can access
    this.Api.AppLicense().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.licAppData = res.data;
          this.convertToObj();

          this.sharedService.setApp(this.licAppData);
        }
      },
      (error) => {}
    );
  }
  onInputValueChange(event, item, index) {
    this.dataSource.filteredData[index]['isButtonDisable'] = false;
    // this.connectionStringData[index].isSqlButtonDisable = false;
  }
  convertToObj() {
    const arrayOfObjects: any = [];
    for (const key of Object.keys(this.licAppData)) {
      // arrayOfObjects.push({ key, value: this.licAppData[key] });
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
  saveLicense(item) {

    let payload = {
      LicenseString: item.license,
      AppUrl:item.appurl,
      DisplayName:item.displayname,
      AppName: item.appname
    };
    this.Api
      .ValidateLicenseSave(payload)
      .subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.getAppLicense();
            this.toastr.success(res.responseMessage, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }else if(!res.isExecuted){
           

            let dialogRef = this.dialog.open(LicensingInvalidComponent, {
              width: '550px',
              autoFocus: '__non_existing_element__',
      disableClose:true,


              data: {
                displayName:item.displayname,
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
        },
        (error) => {
          this.toastr.error(labels.alert.went_worng, 'Error!!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      );
  }
  addLincenseRow() {
    this.dataSource.filteredData.push(this.createObjectNewConn());
    this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
  }
  createObjectNewConn() {
    const newLicenceObj: any = {};
    newLicenceObj.appname = '';
    newLicenceObj.displayname = '';
    newLicenceObj.license = '';
    newLicenceObj.numlicense = '';
    newLicenceObj.status = true;
    newLicenceObj.appurl = '';
    newLicenceObj.isButtonDisable = true;
    newLicenceObj.isNewConn = true;
    return newLicenceObj;
  }
}
