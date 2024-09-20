import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IEmployee } from 'src/app/common/interface/Iemployee';
import { AuthService } from '../../../common/init/auth.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { LiveAnnouncerMessage, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-employees-lookup',
  templateUrl: './employees-lookup.component.html',
  styleUrls: ['./employees-lookup.component.scss']
})
export class EmployeesLookupComponent implements OnInit {
  emp: IEmployee;
  employees_res: any;
  employee_data_source: any = [];
  public env;
  @Input('childLookUp') isLookUp: boolean;
  @Output() updateIsLookUp = new EventEmitter();
  userData: any;
  selectedRowIndex = -1;
  public searchVal: any;

  highlight(row) {
    this.selectedRowIndex = row.id;
  }
  public iAdminApiService: IAdminApiService;
  // table initialization
  displayedColumns: string[] = ['lastName', 'firstName', 'mi', 'userName'];
  constructor(private _liveAnnouncer: LiveAnnouncer, private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService) {
    this.iAdminApiService = adminApiService;

  }

  @ViewChild(MatSort) sort: MatSort;
  employees_details_data: [] = [];
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.env = JSON.parse(localStorage.getItem('env') ?? '');
    this.EmployeeLookUp();

  }
  EmployeeLookUp(LastName: any = "", IsLoader = true) {

    this.emp = {
      "lastName": LastName,
    };
    this.iAdminApiService.getAdminEmployeeLookup(this.emp, false)
      .subscribe((response: any) => {
        if (response.isExecuted && response.data) {
          this.employee_data_source = new MatTableDataSource(response.data.employees);
          if (response.data.passwordExpiryMessage.item1 == 100){
            this.global.ShowToastr(ToasterType.Info,response.data.passwordExpiryMessage.item2 , ToasterTitle.Alert);
          }

        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("getAdminEmployeeLookup", response.responseMessage);
        }

      });
  }
  ngAfterViewInit() {
    this.employee_data_source.sort = this.sort;
    setTimeout(() => {
      this.searchBoxField?.nativeElement.focus();
    }, 500);

  }


  public clear() {
    this.searchVal = '';
    this.EmployeeLookUp();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue?.trim()?.toLowerCase()) this.EmployeeLookUp(filterValue?.trim()?.toLowerCase(), false);
    else this.EmployeeLookUp();
    // this.employee_data_source.filter = ;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.employee_data_source.sort = this.sort;
  }
  getEmpDetails(empData: any) {
    this.isLookUp = true;
    this.updateIsLookUp.emit({ userData: empData, isLookUp: this.isLookUp });
  }
}
